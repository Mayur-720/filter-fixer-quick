
import React, { useState } from "react";
import { Creator } from "../types/Creator";
import {
	X,
	ExternalLink,
	MapPin,
	Users,
	Eye,
	TrendingUp,
	Calendar,
	Tag,
	Play,
	Image as ImageIcon,
} from "lucide-react";
import { formatNumber } from "../utils/formatNumbers";

interface CreatorModalProps {
	creator: Creator;
	onClose: () => void;
}

const CreatorModal: React.FC<CreatorModalProps> = ({ creator, onClose }) => {
	const [selectedMedia, setSelectedMedia] = useState<string | null>(null);

	const handleBackdropClick = (e: React.MouseEvent) => {
		if (e.target === e.currentTarget) {
			onClose();
		}
	};

	const openMediaModal = (mediaUrl: string) => {
		setSelectedMedia(mediaUrl);
	};

	const closeMediaModal = () => {
		setSelectedMedia(null);
	};

	return (
		<>
			<div
				className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
				onClick={handleBackdropClick}
			>
				<div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
					{/* Header */}
					<div className="sticky top-0 bg-white border-b border-gray-200 p-6 rounded-t-2xl">
						<div className="flex items-start justify-between">
							<div className="flex items-start space-x-4">
								<img
									src={creator.avatar}
									alt={creator.name}
									className="w-20 h-20 rounded-full object-cover border-2 border-purple-200"
								/>
								<div>
									<h2 className="text-2xl font-bold text-gray-900 mb-1">
										{creator.name}
									</h2>
									<p className="text-purple-600 font-medium bg-purple-50 px-3 py-1 rounded-full text-sm inline-block mb-2">
										{creator.genre}
									</p>
									<div className="flex items-center text-gray-500 text-sm">
										<MapPin size={14} className="mr-1" />
										<span>{creator.location || creator.details?.location || "Unknown"}</span>
									</div>
								</div>
							</div>
							<button
								onClick={onClose}
								className="text-gray-400 hover:text-gray-600 transition-colors p-2"
							>
								<X size={24} />
							</button>
						</div>
					</div>

					{/* Content */}
					<div className="p-6 space-y-8">
						{/* Quick Stats */}
						<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
							<div className="bg-blue-50 rounded-xl p-4 text-center">
								<div className="flex items-center justify-center text-blue-500 mb-2">
									<Users size={24} />
								</div>
								<p className="text-sm text-gray-600 mb-1">Followers</p>
								<p className="text-2xl font-bold text-gray-900">
									{formatNumber(creator.details.analytics.followers)}
								</p>
							</div>
							<div className="bg-green-50 rounded-xl p-4 text-center">
								<div className="flex items-center justify-center text-green-500 mb-2">
									<Eye size={24} />
								</div>
								<p className="text-sm text-gray-600 mb-1">Total Views</p>
								<p className="text-2xl font-bold text-gray-900">
									{formatNumber(creator.details.analytics.totalViews)}
								</p>
							</div>
							<div className="bg-orange-50 rounded-xl p-4 text-center">
								<div className="flex items-center justify-center text-orange-500 mb-2">
									<TrendingUp size={24} />
								</div>
								<p className="text-sm text-gray-600 mb-1">Avg Views</p>
								<p className="text-2xl font-bold text-gray-900">
									{formatNumber(creator.details.analytics.averageViews || 0)}
								</p>
							</div>
						</div>

						{/* Bio */}
						<div>
							<h3 className="text-lg font-semibold text-gray-900 mb-3">About</h3>
							<p className="text-gray-700 leading-relaxed bg-gray-50 p-4 rounded-xl">
								{creator.details.bio}
							</p>
						</div>

						{/* Platform & Social */}
						<div className="flex items-center justify-between bg-gradient-to-r from-purple-50 to-blue-50 p-4 rounded-xl">
							<div className="flex items-center space-x-4">
								<span className="inline-flex items-center px-3 py-2 rounded-full text-sm font-medium bg-white text-gray-800 shadow-sm">
									{creator.platform}
								</span>
								{creator.details.analytics.engagement && (
									<span className="text-sm text-gray-600">
										<strong>Engagement:</strong> {creator.details.analytics.engagement}
									</span>
								)}
							</div>
							<a
								href={creator.socialLink}
								target="_blank"
								rel="noopener noreferrer"
								className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium"
							>
								<ExternalLink size={16} className="mr-2" />
								Visit Profile
							</a>
						</div>

						{/* Tags */}
						{creator.details.tags && creator.details.tags.length > 0 && (
							<div>
								<h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
									<Tag size={20} className="mr-2" />
									Tags
								</h3>
								<div className="flex flex-wrap gap-2">
									{creator.details.tags.map((tag, index) => (
										<span
											key={index}
											className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
										>
											{tag}
										</span>
									))}
								</div>
							</div>
						)}

						{/* Media Gallery */}
						{creator.details.media && creator.details.media.length > 0 && (
							<div>
								<h3 className="text-lg font-semibold text-gray-900 mb-3">
									Media Gallery
								</h3>
								<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
									{creator.details.media.map((media) => (
										<div
											key={media.id}
											className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden cursor-pointer hover:opacity-90 transition-opacity"
											onClick={() => openMediaModal(media.url)}
										>
											{media.type === 'video' ? (
												<div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-100 to-purple-100">
													<Play size={24} className="text-blue-500" />
												</div>
											) : (
												<img
													src={media.url}
													alt={media.caption || 'Media'}
													className="w-full h-full object-cover"
												/>
											)}
											{media.type === 'video' && (
												<div className="absolute top-2 left-2">
													<div className="bg-black/70 text-white px-2 py-1 rounded text-xs flex items-center gap-1">
														<Play size={12} />
														Video
													</div>
												</div>
											)}
										</div>
									))}
								</div>
							</div>
						)}

						{/* Reels */}
						{creator.details.reels && creator.details.reels.length > 0 && (
							<div>
								<h3 className="text-lg font-semibold text-gray-900 mb-3">
									Featured Reels
								</h3>
								<div className="space-y-2">
									{creator.details.reels.map((reel, index) => (
										<a
											key={index}
											href={reel}
											target="_blank"
											rel="noopener noreferrer"
											className="block p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
										>
											<div className="flex items-center text-purple-600 hover:text-purple-800">
												<Play size={16} className="mr-2" />
												<span className="text-sm font-medium">Reel {index + 1}</span>
											</div>
										</a>
									))}
								</div>
							</div>
						)}

						{/* Timestamps */}
						{creator.createdAt && (
							<div className="text-sm text-gray-500 border-t pt-6">
								<div className="flex items-center">
									<Calendar size={16} className="mr-2" />
									<span>
										Added on {new Date(creator.createdAt).toLocaleDateString()}
									</span>
								</div>
							</div>
						)}
					</div>
				</div>
			</div>

			{/* Media Modal */}
			{selectedMedia && (
				<div
					className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-60 p-4"
					onClick={closeMediaModal}
				>
					<div className="relative max-w-4xl max-h-[90vh]">
						<button
							onClick={closeMediaModal}
							className="absolute -top-12 right-0 text-white hover:text-gray-300 transition-colors"
						>
							<X size={24} />
						</button>
						<img
							src={selectedMedia}
							alt="Media"
							className="max-w-full max-h-[90vh] object-contain rounded-lg"
						/>
					</div>
				</div>
			)}
		</>
	);
};

export default CreatorModal;
