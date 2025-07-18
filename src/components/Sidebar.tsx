import React from "react";
import {
	Users,
	Video,
	Lightbulb,
	Laptop,
	Heart,
	Building2,
	ChevronLeft,
	ChevronRight,
	MessageCircleMore,
} from "lucide-react";
import WhatsAppButton from "./WhatsAppButton";
import { useNavigate } from "react-router-dom";

interface SidebarProps {
	activeGenre: string;
	onGenreChange: (genre: string) => void;
	isCollapsed: boolean;
	onToggleCollapse: () => void;
}

const genres = [
	{ name: "All Creators", icon: Users },
	{ name: "AI Creators", icon: Lightbulb },
	{ name: "Video Editing", icon: Video },
	{ name: "Tech Product", icon: Laptop },
	{ name: "Tips & Tricks", icon: Lightbulb },
	{ name: "Business", icon: Building2 },
	{ name: "Lifestyle", icon: Heart },
];

const Sidebar: React.FC<SidebarProps> = ({
	activeGenre,
	onGenreChange,
	isCollapsed,
	onToggleCollapse,
}) => {
	const navigate = useNavigate();
	return (
		<div
			className={`fixed left-0 top-0 h-full bg-brand-black/5 shadow-xl border-r border-brand-black/10 transition-all duration-300 z-30 ${
				isCollapsed ? "w-16" : "w-64"
			} flex flex-col font-poppins`}
		>
			{/* Header */}
			<div className="p-4 border-b border-brand-black/10 flex items-center justify-between">
				{!isCollapsed ? (
					<div
						className="w-full hover:cursor-pointer"
						onClick={() => onGenreChange("All Creators")}
					>
						<img
							src="https://res.cloudinary.com/ds7bybp6g/image/upload/v1750859567/creatordream_nlvcgd.png"
							alt="CreatorDream Logo"
							className="h-12 w-auto object-contain"
						/>
					</div>
				) : (
					<div className="w-full flex items-center justify-center">
						<img
							src="https://res.cloudinary.com/ds7bybp6g/image/upload/v1750859567/creatordream_nlvcgd.png"
							alt="CreatorDream Logo"
							className="h-6 w-auto object-contain"
						/>
					</div>
				)}
				<button
					onClick={onToggleCollapse}
					className="p-2 rounded-lg hover:bg-brand-aureolin/20 transition-colors flex-shrink-0"
				>
					{isCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
				</button>
			</div>

			{/* Navigation */}
			<nav className="flex-1 p-2 space-y-1">
				{genres.map((genre) => {
					const Icon = genre.icon;
					const isActive = activeGenre === genre.name;

					return (
						<button
							key={genre.name}
							onClick={() => onGenreChange(genre.name)}
							className={`w-full flex items-center space-x-3 px-3 py-3 rounded-lg transition-all duration-200 text-left relative group ${
								isActive
									? "bg-brand-orange text-white shadow-lg"
									: "text-brand-black hover:bg-brand-aureolin/20 hover:text-brand-purple"
							}`}
							title={isCollapsed ? genre.name : undefined}
						>
							<Icon size={20} className="flex-shrink-0" />
							{!isCollapsed && (
								<span className="font-medium">{genre.name}</span>
							)}

							{/* Tooltip */}
							{isCollapsed && (
								<div className="absolute left-full ml-2 px-2 py-1 bg-brand-black text-white text-sm rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
									{genre.name}
								</div>
							)}
						</button>
					);
				})}
			</nav>

			{/* WhatsApp Button at Bottom */}
			<div className="p-4 border-t border-brand-black/10 mt-auto">
				{isCollapsed ? (
					<MessageCircleMore className="ml-1 text-green-600" />
				) : (
					<WhatsAppButton variant="sidebar" />
				)}
			</div>
		</div>
	);
};

export default Sidebar;
