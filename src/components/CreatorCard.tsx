
import React from "react";
import { Creator } from "../types/Creator";
import { ExternalLink, MapPin, Users, Eye, TrendingUp } from "lucide-react";
import { formatNumber } from "../utils/formatNumbers";

interface CreatorCardProps {
	creator: Creator;
	onClick: (creator: Creator) => void;
}

const CreatorCard: React.FC<CreatorCardProps> = ({ creator, onClick }) => {
	const handleCardClick = () => {
		onClick(creator);
	};

	const handleLinkClick = (e: React.MouseEvent) => {
		e.stopPropagation();
	};

	return (
		<div
			className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer border border-gray-100 hover:border-purple-200 group overflow-hidden"
			onClick={handleCardClick}
		>
			{/* Header with Avatar and Basic Info */}
			<div className="p-6 pb-4">
				<div className="flex items-start space-x-4">
					<img
						src={creator.avatar}
						alt={creator.name}
						className="w-16 h-16 rounded-full object-cover border-2 border-gray-100 group-hover:border-purple-200 transition-colors"
					/>
					<div className="flex-1 min-w-0">
						<h3 className="text-xl font-bold text-gray-900 truncate group-hover:text-purple-600 transition-colors">
							{creator.name}
						</h3>
						<p className="text-purple-600 font-medium text-sm bg-purple-50 px-2 py-1 rounded-full inline-block mt-1">
							{creator.genre}
						</p>
						<div className="flex items-center text-gray-500 text-sm mt-2">
							<MapPin size={14} className="mr-1" />
							<span>{creator.location || creator.details?.location || "Unknown"}</span>
						</div>
					</div>
				</div>
			</div>

			{/* Quick Stats */}
			<div className="px-6 pb-4">
				<div className="grid grid-cols-3 gap-4">
					<div className="text-center">
						<div className="flex items-center justify-center text-blue-500 mb-1">
							<Users size={16} />
						</div>
						<p className="text-xs text-gray-500">Followers</p>
						<p className="font-bold text-sm text-gray-900">
							{formatNumber(creator.details.analytics.followers)}
						</p>
					</div>
					<div className="text-center">
						<div className="flex items-center justify-center text-green-500 mb-1">
							<Eye size={16} />
						</div>
						<p className="text-xs text-gray-500">Total Views</p>
						<p className="font-bold text-sm text-gray-900">
							{formatNumber(creator.details.analytics.totalViews)}
						</p>
					</div>
					<div className="text-center">
						<div className="flex items-center justify-center text-orange-500 mb-1">
							<TrendingUp size={16} />
						</div>
						<p className="text-xs text-gray-500">Avg Views</p>
						<p className="font-bold text-sm text-gray-900">
							{formatNumber(creator.details.analytics.averageViews || 0)}
						</p>
					</div>
				</div>
			</div>

			{/* Platform and Social Link */}
			<div className="px-6 pb-6">
				<div className="flex items-center justify-between">
					<span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
						{creator.platform}
					</span>
					<a
						href={creator.socialLink}
						target="_blank"
						rel="noopener noreferrer"
						onClick={handleLinkClick}
						className="inline-flex items-center text-purple-600 hover:text-purple-800 text-sm font-medium transition-colors"
					>
						<ExternalLink size={14} className="mr-1" />
						Profile
					</a>
				</div>
			</div>
		</div>
	);
};

export default CreatorCard;
