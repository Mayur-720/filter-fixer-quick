
import React, { useState } from 'react';
import { Upload, Trash2, Play, Image as ImageIcon } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { MediaFile } from '../../types/Creator';

interface MediaManagerProps {
  creatorId?: string;
  media: MediaFile[];
  onMediaAdd: (file: File, caption: string) => Promise<void>;
  onMediaDelete: (mediaId: string) => Promise<void>;
}

const MediaManager: React.FC<MediaManagerProps> = ({
  creatorId,
  media,
  onMediaAdd,
  onMediaDelete,
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [caption, setCaption] = useState('');
  const [uploading, setUploading] = useState(false);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile || !creatorId) return;

    setUploading(true);
    try {
      await onMediaAdd(selectedFile, caption);
      setSelectedFile(null);
      setCaption('');
    } catch (error) {
      console.error('Upload failed:', error);
    } finally {
      setUploading(false);
    }
  };

  const isVideo = (file: File) => file.type.startsWith('video/');

  return (
    <div className="space-y-6">
      <div>
        <h4 className="text-lg font-semibold mb-4">Media Management</h4>
        
        {/* Upload Section */}
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 mb-6">
          <div className="text-center">
            <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <Label htmlFor="media-upload" className="cursor-pointer">
              <span className="text-sm font-medium text-gray-700">
                Click to upload media
              </span>
              <Input
                id="media-upload"
                type="file"
                accept="image/*,video/*"
                onChange={handleFileSelect}
                className="hidden"
              />
            </Label>
            
            {selectedFile && (
              <div className="mt-4 space-y-3">
                <div className="flex items-center justify-center gap-2">
                  {isVideo(selectedFile) ? (
                    <Play size={16} />
                  ) : (
                    <ImageIcon size={16} />
                  )}
                  <span className="text-sm text-gray-600">
                    {selectedFile.name}
                  </span>
                </div>
                
                <Textarea
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  placeholder="Add a caption (optional)"
                  rows={2}
                />
                
                <div className="flex gap-2">
                  <Button
                    onClick={handleUpload}
                    disabled={uploading}
                    size="sm"
                  >
                    {uploading ? 'Uploading...' : 'Upload'}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setSelectedFile(null);
                      setCaption('');
                    }}
                    size="sm"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Media Grid */}
        {media.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {media.map((item) => (
              <div
                key={item.id}
                className="relative bg-gray-100 rounded-lg overflow-hidden aspect-square group"
              >
                {item.type === 'video' ? (
                  <video
                    src={item.url}
                    className="w-full h-full object-cover"
                    poster={item.thumbnail}
                  />
                ) : (
                  <img
                    src={item.url}
                    alt={item.caption || 'Media'}
                    className="w-full h-full object-cover"
                  />
                )}
                
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-all flex items-center justify-center">
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => onMediaDelete(item.id)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Trash2 size={16} />
                  </Button>
                </div>
                
                {item.type === 'video' && (
                  <div className="absolute top-2 left-2">
                    <Play size={16} className="text-white drop-shadow-md" />
                  </div>
                )}
                
                {item.caption && (
                  <div className="absolute bottom-0 left-0 right-0 bg-black/70 text-white p-2 text-xs">
                    {item.caption}
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center py-8">
            No media files uploaded yet
          </p>
        )}
      </div>
    </div>
  );
};

export default MediaManager;
