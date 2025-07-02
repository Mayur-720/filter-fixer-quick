
import React, { useState } from "react";
import { Creator } from "../types/Creator";
import {
	X,
	Users,
	Eye,
	Star,
	Play,
	Instagram,
	ZoomIn,
	ZoomOut,
	Pause,
	Volume2,
	VolumeX,
	Maximize,
	Download,
} from "lucide-react";
import { useInstagramData } from "../hooks/useInstagramData";

interface CreatorModalProps {
	creator: Creator;
	onClose: () => void;
}

const CreatorModal: React.FC<CreatorModalProps> = ({ creator, onClose }) => {
	const { media: instagramMedia, loading: instagramLoading } = useInstagramData(
		creator.platform === "Instagram" ? creator.socialLink : ""
	);

	const [selectedMedia, setSelectedMedia] = useState<any>(null);
	const [isPlaying, setIsPlaying] = useState(false);
	const [isMuted, setIsMuted] = useState(false);
	const [zoomLevel, setZoomLevel] = useState(1);

	const formatNumber = (num: number) => {
		if (num >= 1000000) {
			return `${(num / 1000000).toFixed(1)}M`;
		} else if (num >= 1000) {
			return `${(num / 1000).toFixed(1)}K`;
		}
		return num.toString();
	};

	const handleMediaClick = (media: any) => {
		setSelectedMedia(media);
		setZoomLevel(1);
	};

	const handleVideoPlay = () => {
		setIsPlaying(!isPlaying);
		const video = document.getElementById('modal-video') as HTMLVideoElement;
		if (video) {
			if (isPlaying) {
				video.pause();
			} else {
				video.play();
			}
		}
	};

	const handleMute = () => {
		setIsMuted(!isMuted);
		const video = document.getElementById('modal-video') as HTMLVideoElement;
		if (video) {
			video.muted = !isMuted;
		}
	};

	const handleZoomIn = () => {
		setZoomLevel(prev => Math.min(prev + 0.5, 3));
	};

	const handleZoomOut = () => {
		setZoomLevel(prev => Math.max(prev - 0.5, 0.5));
	};

	const handleFullscreen = () => {
		const element = document.getElementById('media-viewer');
		if (element) {
			element.requestFullscreen();
		}
	};

	return (
		<div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
			<div className="bg-background rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
				<div className="sticky top-0 bg-background border-b border-border p-4 md:p-6 flex items-center justify-between">
					<h2 className="text-xl md:text-2xl font-bold text-foreground">
						Creator Profile
					</h2>
					<button
						onClick={onClose}
						className="p-2 hover:bg-accent rounded-full transition-colors"
					>
						<X size={24} />
					</button>
				</div>

				<div className="p-4 md:p-6">
					<div className="grid lg:grid-cols-3 gap-6 md:gap-8">
						{/* Left Section - Creator Info */}
						<div className="lg:col-span-1">
							<div className="text-center mb-6">
								<div className="w-32 h-32 mx-auto mb-4 rounded-2xl overflow-hidden shadow-lg">
									<img
										src={creator.avatar}
										alt={creator.name}
										className="w-full h-full object-cover"
									/>
								</div>
								<h3 className="text-xl md:text-2xl font-bold text-foreground mb-2">
									{creator.name}
								</h3>
								<div className="flex flex-wrap gap-2 justify-center mb-4">
									{creator.details.tags.map((tag, index) => (
										<span
											key={index}
											className="px-3 py-1 bg-gradient-to-r from-purple-100 to-blue-100 text-purple-700 text-sm rounded-full"
										>
											{tag}
										</span>
									))}
								</div>
							</div>

							<div className="bg-accent rounded-xl p-4 mb-6">
								<h4 className="font-semibold text-foreground mb-3">
									Quick Stats
								</h4>
								<div className="space-y-3">
									<div className="flex items-center justify-between">
										<div className="flex items-center space-x-2">
											<Users size={16} className="text-purple-500" />
											<span className="text-sm text-muted-foreground">
												Followers
											</span>
										</div>
										<span className="font-semibold text-foreground">
											{formatNumber(creator.details.analytics.followers)}
										</span>
									</div>
									{creator.details.analytics.averageViews && (
										<div className="flex items-center justify-between">
											<div className="flex items-center space-x-2">
												<Eye size={16} className="text-green-500" />
												<span className="text-sm text-muted-foreground">
													Average Views
												</span>
											</div>
											<span className="font-semibold text-foreground">
												{formatNumber(creator.details.analytics.averageViews)}
											</span>
										</div>
									)}
									<div className="flex items-center justify-between">
										<div className="flex items-center space-x-2">
											<Eye size={16} className="text-blue-500" />
											<span className="text-sm text-muted-foreground">
												Total Views
											</span>
										</div>
										<span className="font-semibold text-foreground">
											{formatNumber(creator.details.analytics.totalViews)}
										</span>
									</div>
								</div>
							</div>
						</div>

						{/* Right Section - Details */}
						<div className="lg:col-span-2 space-y-6">
							<div>
								<h4 className="text-lg font-semibold text-foreground mb-3">
									About
								</h4>
								<p className="text-muted-foreground leading-relaxed">
									{creator.details.bio}
								</p>
							</div>

							{/* Instagram Media Section */}
							{creator.platform === "Instagram" && (
								<div>
									<h4 className="text-lg font-semibold text-foreground mb-3 flex items-center gap-2">
										<Instagram size={20} className="text-pink-500" />
										Instagram Content
									</h4>

									{instagramLoading ? (
										<div className="grid grid-cols-2 md:grid-cols-3 gap-4">
											{[...Array(6)].map((_, i) => (
												<div
													key={i}
													className="bg-accent rounded-lg aspect-square animate-pulse"
												/>
											))}
										</div>
									) : (
										<div className="grid grid-cols-2 md:grid-cols-3 gap-4">
											{instagramMedia.map((item) => (
												<div
													key={item.id}
													className="bg-accent rounded-lg aspect-square flex items-center justify-center cursor-pointer hover:shadow-md transition-all duration-200 group relative overflow-hidden"
													onClick={() => handleMediaClick(item)}
												>
													{item.media_type === "IMAGE" ? (
														<div className="w-full h-full bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/20 dark:to-pink-900/20 flex items-center justify-center">
															<ZoomIn
																size={24}
																className="text-muted-foreground group-hover:text-purple-500 transition-colors"
															/>
														</div>
													) : (
														<div className="w-full h-full bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/20 dark:to-purple-900/20 flex items-center justify-center">
															<Play
																size={24}
																className="text-muted-foreground group-hover:text-purple-500 transition-colors"
															/>
														</div>
													)}

													<div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />

													{item.caption && (
														<div className="absolute bottom-2 left-2 right-2 text-xs text-white bg-black/50 rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity">
															{item.caption.length > 50
																? `${item.caption.substring(0, 50)}...`
																: item.caption}
														</div>
													)}
												</div>
											))}
										</div>
									)}

									<p className="text-sm text-muted-foreground mt-2">
										* Instagram content is displayed for demonstration. Full
										integration requires Instagram API setup.
									</p>
								</div>
							)}

							{/* Original Reels Section */}
							<div>
								<h4 className="text-lg font-semibold text-foreground mb-3">
									Portfolio Content
								</h4>
								<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
									{creator.details.reels.map((reel, index) => (
										<div
											key={index}
											className="bg-accent rounded-lg aspect-video flex items-center justify-center cursor-pointer hover:shadow-md transition-all duration-200 group"
										>
											<div className="text-center">
												<Play
													size={32}
													className="text-muted-foreground mx-auto mb-2 group-hover:text-purple-500 transition-colors"
												/>
												<p className="text-sm text-muted-foreground">{reel}</p>
											</div>
										</div>
									))}
								</div>
							</div>

							<div className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-xl p-6">
								<div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
									<button className="flex-1 bg-gradient-to-r from-purple-500 to-blue-500 text-white py-3 px-6 rounded-lg font-medium hover:shadow-lg transition-all duration-200">
										Contact Creator
									</button>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>

			{/* Media Viewer Modal */}
			{selectedMedia && (
				<div className="fixed inset-0 bg-black/90 flex items-center justify-center p-4 z-60">
					<div id="media-viewer" className="relative max-w-4xl max-h-full">
						<div className="absolute top-4 right-4 flex gap-2 z-10">
							<button
								onClick={handleFullscreen}
								className="p-2 bg-black/50 text-white rounded-full hover:bg-black/70 transition-colors"
							>
								<Maximize size={20} />
							</button>
							<button
								onClick={() => setSelectedMedia(null)}
								className="p-2 bg-black/50 text-white rounded-full hover:bg-black/70 transition-colors"
							>
								<X size={20} />
							</button>
						</div>

						{selectedMedia.media_type === 'VIDEO' ? (
							<div className="relative">
								<video
									id="modal-video"
									className="max-w-full max-h-[80vh] rounded-lg"
									controls
									autoPlay
									src={selectedMedia.media_url}
								/>
								<div className="absolute bottom-4 left-4 flex gap-2">
									<button
										onClick={handleVideoPlay}
										className="p-2 bg-black/50 text-white rounded-full hover:bg-black/70 transition-colors"
									>
										{isPlaying ? <Pause size={20} /> : <Play size={20} />}
									</button>
									<button
										onClick={handleMute}
										className="p-2 bg-black/50 text-white rounded-full hover:bg-black/70 transition-colors"
									>
										{isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
									</button>
								</div>
							</div>
						) : (
							<div className="relative">
								<img
									src={selectedMedia.media_url}
									alt="Media content"
									className="max-w-full max-h-[80vh] rounded-lg transition-transform duration-200"
									style={{ transform: `scale(${zoomLevel})` }}
								/>
								<div className="absolute bottom-4 left-4 flex gap-2">
									<button
										onClick={handleZoomIn}
										className="p-2 bg-black/50 text-white rounded-full hover:bg-black/70 transition-colors"
									>
										<ZoomIn size={20} />
									</button>
									<button
										onClick={handleZoomOut}
										className="p-2 bg-black/50 text-white rounded-full hover:bg-black/70 transition-colors"
									>
										<ZoomOut size={20} />
									</button>
								</div>
							</div>
						)}

						{selectedMedia.caption && (
							<div className="mt-4 p-4 bg-black/50 text-white rounded-lg">
								<p>{selectedMedia.caption}</p>
							</div>
						)}
					</div>
				</div>
			)}
		</div>
	);
};

export default CreatorModal;
