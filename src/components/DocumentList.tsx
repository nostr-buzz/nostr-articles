import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  FileText, 
  Edit3, 
  Calendar, 
  Search,
  Plus,
  Eye,
  Loader2,
  User,
  Heart,
  MessageCircle,
  Zap
} from 'lucide-react';
import { useDocuments, useContacts } from '@/hooks/useDocuments';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { useAuthor } from '@/hooks/useAuthor';
import { useDocumentInteractions } from '@/hooks/useDocumentInteractions';
import { getDocumentTitle, getDocumentSummary, getDocumentTags, getDocumentIdentifier, isDraft, createDocumentNaddr } from '@/lib/documentUtils';
import { genUserName } from '@/lib/genUserName';
import { formatRelativeTimeShort } from '@/lib/formatTime';
import type { DocumentEvent } from '@/hooks/useDocuments';

interface DocumentListProps {
  showCreateButton?: boolean;
}

export function DocumentList({ showCreateButton = true }: DocumentListProps) {
  const { user } = useCurrentUser();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'published' | 'drafts'>('all');
  const [showConnectionsOnly, setShowConnectionsOnly] = useState(() => {
    const saved = localStorage.getItem('documents:showConnectionsOnly');
    return saved ? JSON.parse(saved) : false;
  });
  
  // Get user's contacts
  const { data: followedPubkeys = [] } = useContacts(user?.pubkey || '');
  
  // Get documents with infinite scroll
  const {
    data,
    isLoading,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useDocuments(showConnectionsOnly ? 'connections' : 'all', followedPubkeys);

  // Flatten all pages of documents
  const documents = data?.pages.flatMap(page => page.documents) || [];

  const filteredDocuments = documents.filter((doc) => {
    const title = getDocumentTitle(doc).toLowerCase();
    const summary = getDocumentSummary(doc).toLowerCase();
    const content = doc.content.toLowerCase();
    const tags = getDocumentTags(doc);
    
    const matchesSearch = searchTerm === '' || 
      title.includes(searchTerm.toLowerCase()) ||
      summary.includes(searchTerm.toLowerCase()) ||
      content.includes(searchTerm.toLowerCase()) ||
      tags.some(tag => tag.includes(searchTerm.toLowerCase()));

    const matchesFilter = filterType === 'all' ||
      (filterType === 'published' && !isDraft(doc)) ||
      (filterType === 'drafts' && isDraft(doc));

    return matchesSearch && matchesFilter;
  });

  // Persist showConnectionsOnly state
  useEffect(() => {
    localStorage.setItem('documents:showConnectionsOnly', JSON.stringify(showConnectionsOnly));
  }, [showConnectionsOnly]);

  // Infinite scroll effect
  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop
        >= document.documentElement.offsetHeight - 1000
      ) {
        if (hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">Failed to load articles. Please try again.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Articles</h1>
          <p className="text-muted-foreground">
            Manage your Nostr articles and drafts
          </p>
        </div>
        
        {showCreateButton && (
          <Button asChild>
            <Link to="/new">
              <Plus className="h-4 w-4 mr-2" />
              New Article
            </Link>
          </Button>
        )}
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search articles..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <div className="flex gap-2">
            <Button
              variant={filterType === 'all' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilterType('all')}
            >
              All
            </Button>
            <Button
              variant={filterType === 'published' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilterType('published')}
            >
              Published
            </Button>
            <Button
              variant={filterType === 'drafts' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilterType('drafts')}
            >
              Drafts
            </Button>
          </div>
        </div>
        
        {/* Connections Filter */}
        {user && (
          <div className="flex items-center space-x-2">
            <Switch
              id="connections-only"
              checked={showConnectionsOnly}
              onCheckedChange={setShowConnectionsOnly}
            />
            <Label htmlFor="connections-only">
              Show only articles from my connections ({followedPubkeys.length} contacts)
            </Label>
          </div>
        )}
      </div>

      {/* Document Grid */}
      {isLoading && documents.length === 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-full" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-2/3" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : filteredDocuments.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDocuments.map((doc) => (
              <DocumentCard key={doc.id} document={doc} />
            ))}
          </div>
          
          {/* Infinite scroll loading indicator */}
          {isFetchingNextPage && (
            <div className="flex justify-center py-8">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" />
                Loading more articles...
              </div>
            </div>
          )}
          
          {/* Load more button as fallback */}
          {hasNextPage && !isFetchingNextPage && (
            <div className="flex justify-center py-8">
              <Button variant="outline" onClick={() => fetchNextPage()}>
                Load More Articles
              </Button>
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-12">
          <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">No articles found</h3>
          <p className="text-muted-foreground mb-4">
            {searchTerm || filterType !== 'all' || showConnectionsOnly
              ? 'Try adjusting your search or filter criteria.'
              : 'Get started by creating your first article.'
            }
          </p>
          {showCreateButton && !searchTerm && filterType === 'all' && !showConnectionsOnly && (
            <Button asChild>
              <Link to="/new">
                <Plus className="h-4 w-4 mr-2" />
                Create Article
              </Link>
            </Button>
          )}
        </div>
      )}
    </div>
  );
}

function DocumentCard({ document }: { document: DocumentEvent }) {
  const { user } = useCurrentUser();
  const author = useAuthor(document.pubkey);
  const title = getDocumentTitle(document);
  const summary = getDocumentSummary(document);
  const tags = getDocumentTags(document);
  const isDocumentDraft = isDraft(document);
  const identifier = getDocumentIdentifier(document);
  const naddr = createDocumentNaddr(document);
  const isOwnDocument = user?.pubkey === document.pubkey;

  // Author info
  const authorMetadata = author.data?.metadata;
  const authorName = authorMetadata?.display_name || authorMetadata?.name || genUserName(document.pubkey);
  const authorAvatar = authorMetadata?.picture;

  // Interaction counts with intersection observer
  const { ref: interactionRef, likeCount, commentCount, zapCount, isLoading, hasInteractions } = useDocumentInteractions(document);

  // Truncate content for preview
  const contentPreview = document.content.length > 150 
    ? document.content.substring(0, 150) + '...'
    : document.content;

  return (
    <Card ref={interactionRef} className="hover:shadow-md transition-shadow flex flex-col h-full">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <CardTitle className="text-lg line-clamp-2 flex-1">
            {title}
          </CardTitle>
          <Badge variant={isDocumentDraft ? 'secondary' : 'default'} className="ml-2">
            {isDocumentDraft ? 'Draft' : 'Published'}
          </Badge>
        </div>
        
        {summary && (
          <p className="text-sm text-muted-foreground line-clamp-2">
            {summary}
          </p>
        )}
      </CardHeader>
      
      <CardContent className="pt-0 flex-1 flex flex-col">
        <div className="flex-1 flex flex-col">
          {/* Content Preview */}
          <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
            {contentPreview}
          </p>
          
          {/* Tags */}
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-4">
              {tags.slice(0, 3).map((tag) => (
                <Badge key={tag} variant="outline" className="text-xs">
                  {tag}
                </Badge>
              ))}
              {tags.length > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{tags.length - 3}
                </Badge>
              )}
            </div>
          )}
        </div>
        
        {/* Author Info */}
        <div className="flex items-center gap-2 mb-3 pb-3 border-b">
          <Avatar className="h-6 w-6">
            <AvatarImage src={authorAvatar} alt={authorName} />
            <AvatarFallback className="text-xs">
              <User className="h-3 w-3" />
            </AvatarFallback>
          </Avatar>
          <span className="text-sm font-medium text-muted-foreground">
            {authorName}
          </span>
          <div className="flex items-center gap-1 text-xs text-muted-foreground ml-auto">
            <Calendar className="h-3 w-3" />
            {formatRelativeTimeShort(document.created_at)}
          </div>
        </div>

        {/* Interaction Stats */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            {isLoading ? (
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  <Heart className="h-3 w-3 opacity-50" />
                  <div className="w-3 h-3 bg-muted rounded animate-pulse" />
                </div>
                <div className="flex items-center gap-1">
                  <MessageCircle className="h-3 w-3 opacity-50" />
                  <div className="w-3 h-3 bg-muted rounded animate-pulse" />
                </div>
                <div className="flex items-center gap-1">
                  <Zap className="h-3 w-3 opacity-50" />
                  <div className="w-3 h-3 bg-muted rounded animate-pulse" />
                </div>
              </div>
            ) : hasInteractions ? (
              <>
                {likeCount > 0 && (
                  <div className="flex items-center gap-1">
                    <Heart className="h-3 w-3" />
                    <span>{likeCount}</span>
                  </div>
                )}
                {commentCount > 0 && (
                  <div className="flex items-center gap-1">
                    <MessageCircle className="h-3 w-3" />
                    <span>{commentCount}</span>
                  </div>
                )}
                {zapCount > 0 && (
                  <div className="flex items-center gap-1">
                    <Zap className="h-3 w-3" />
                    <span>{zapCount}</span>
                  </div>
                )}
              </>
            ) : null}
          </div>
          
          <div className="flex items-center gap-2">
            <Button size="sm" variant="outline" asChild>
              <Link to={`/document/${naddr}`}>
                <Eye className="h-3 w-3 mr-1" />
                View
              </Link>
            </Button>
            {isOwnDocument && (
              <Button size="sm" variant="outline" asChild>
                <Link to={`/edit/${identifier}`}>
                  <Edit3 className="h-3 w-3 mr-1" />
                  Edit
                </Link>
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}