
import React, { useState, useEffect } from "react";
import CreatorCard from "./CreatorCard";
import WhatsAppButton from "./WhatsAppButton";
import { Creator } from "../types/Creator";
import { creatorAPI } from "../services/api";
import { Users, Search, ArrowUpDown } from "lucide-react";
import { Input } from "./ui/input";
import { Skeleton } from "./ui/skeleton";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "./ui/select";
import { useIsMobile } from "@/hooks/use-mobile";

interface DashboardProps {
	activeGenre: string;
	onCreatorClick: (creator: Creator) => void;
}

const Dashboard: React.FC<DashboardProps> = ({
	activeGenre,
	onCreatorClick,
}) => {
	const [creators, setCreators] = useState<Creator[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [searchTerm, setSearchTerm] = useState("");
	const [sortBy, setSortBy] = useState("followers");
	const [platformFilter, setPlatformFilter] = useState("All");
	const [locationFilter, setLocationFilter] = useState("All");
	const isMobile = useIsMobile();

	// Fetch creators from API
	useEffect(() => {
		const fetchCreators = async () => {
			setLoading(true);
			setError(null);
			try {
				const data = await creatorAPI.getAll();
				setCreators(data);
			} catch (err) {
				setError("Failed to load creators");
				console.error("Error fetching creators:", err);
			} finally {
				setLoading(false);
			}
		};

		fetchCreators();
	}, []);

	// Simple filtering logic
	const getFilteredCreators = () => {
		let filteredCreators =
			activeGenre === "All Creators"
				? creators
				: creators.filter((creator) => creator.genre === activeGenre);

		// Apply search filter
		if (searchTerm) {
			filteredCreators = filteredCreators.filter(
				(creator) =>
					creator.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
					creator.details?.tags?.some((tag) =>
						tag.toLowerCase().includes(searchTerm.toLowerCase())
					) ||
					creator.genre.toLowerCase().includes(searchTerm.toLowerCase())
			);
		}

		// Apply platform filter
		if (platformFilter !== "All") {
			filteredCreators = filteredCreators.filter(
				(creator) => creator.platform === platformFilter
			);
		}

		// Apply location filter
		if (locationFilter !== "All") {
			filteredCreators = filteredCreators.filter((creator) => {
				const creatorLocation = creator.location || creator.details?.location || "";
				return creatorLocation === locationFilter;
			});
		}

		return filteredCreators;
	};

	const sortCreators = (creators: Creator[], sortBy: string) => {
		return [...creators].sort((a, b) => {
			switch (sortBy) {
				case "followers":
					return (b.details?.analytics?.followers || 0) - (a.details?.analytics?.followers || 0);
				case "views":
					return (b.details?.analytics?.totalViews || 0) - (a.details?.analytics?.totalViews || 0);
				case "name":
					return a.name.localeCompare(b.name);
				default:
					return 0;
			}
		});
	};

	const filteredCreators = sortCreators(getFilteredCreators(), sortBy);

	const handleClearFilters = () => {
		setPlatformFilter("All");
		setLocationFilter("All");
		setSearchTerm("");
		setSortBy("followers");
	};

	// Get unique platforms and locations for filter options
	const platforms = ["All", ...new Set(creators.map(c => c.platform))];
	const locations = ["All", ...new Set(creators.map(c => c.location || c.details?.location).filter(Boolean))];

	if (loading) {
		return (
			<div className="flex-1 flex flex-col overflow-hidden bg-gray-50">
				<header className="bg-white shadow-sm border-b border-gray-200 p-4 lg:p-6">
					<div className="flex flex-col space-y-4">
						<div>
							<Skeleton className="h-8 w-48 mb-2" />
							<Skeleton className="h-4 w-32" />
						</div>
						<div className="flex items-center space-x-3">
							<Skeleton className="h-10 flex-1" />
							<Skeleton className="h-10 w-32" />
							<Skeleton className="h-10 w-32" />
						</div>
					</div>
				</header>
				<div className="flex-1 overflow-y-auto p-4 lg:p-6">
					<div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
						{[...Array(8)].map((_, i) => (
							<Skeleton key={i} className="h-64 w-full rounded-lg" />
						))}
					</div>
				</div>
			</div>
		);
	}

	if (error) {
		return (
			<div className="flex-1 flex flex-col overflow-hidden bg-gray-50">
				<div className="flex-1 flex items-center justify-center">
					<div className="text-center">
						<div className="text-red-400 mb-4">
							<Users size={48} className="mx-auto" />
						</div>
						<h3 className="text-lg font-semibold text-gray-900 mb-2">
							Failed to load creators
						</h3>
						<p className="text-gray-600">{error}</p>
						<button
							onClick={() => window.location.reload()}
							className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
						>
							Retry
						</button>
					</div>
				</div>
			</div>
		);
	}

	return (
		<div className="flex-1 flex flex-col overflow-hidden bg-gray-50">
			{/* Header */}
			<header className="bg-white shadow-sm border-b border-gray-200 p-3 sm:p-4 lg:p-6">
				<div className="flex flex-col space-y-3 sm:space-y-4">
					<div>
						<h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">
							{activeGenre}
						</h2>
						<p className="text-sm sm:text-base text-gray-600 mt-1">
							{filteredCreators.length} creator
							{filteredCreators.length !== 1 ? "s" : ""} available
						</p>
					</div>

					{/* Search and Filters */}
					<div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
						<div className="relative flex-1 min-w-0">
							<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
							<Input
								placeholder="Search creators..."
								value={searchTerm}
								onChange={(e) => setSearchTerm(e.target.value)}
								className="pl-10 w-full"
							/>
						</div>

						<div className="flex items-center gap-2 flex-wrap">
							{/* Platform Filter */}
							<Select value={platformFilter} onValueChange={setPlatformFilter}>
								<SelectTrigger className="w-[120px]">
									<SelectValue placeholder="Platform" />
								</SelectTrigger>
								<SelectContent>
									{platforms.map(platform => (
										<SelectItem key={platform} value={platform}>
											{platform}
										</SelectItem>
									))}
								</SelectContent>
							</Select>

							{/* Location Filter */}
							<Select value={locationFilter} onValueChange={setLocationFilter}>
								<SelectTrigger className="w-[120px]">
									<SelectValue placeholder="Location" />
								</SelectTrigger>
								<SelectContent>
									{locations.map(location => (
										<SelectItem key={location} value={location}>
											{location}
										</SelectItem>
									))}
								</SelectContent>
							</Select>

							{/* Sort */}
							<Select value={sortBy} onValueChange={setSortBy}>
								<SelectTrigger className="w-[100px] sm:w-[140px]">
									<ArrowUpDown size={16} className="mr-2 flex-shrink-0" />
									<SelectValue />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="followers">Followers</SelectItem>
									<SelectItem value="views">Views</SelectItem>
									<SelectItem value="name">Name</SelectItem>
								</SelectContent>
							</Select>

							{/* Clear Filters */}
							{(platformFilter !== "All" || locationFilter !== "All" || searchTerm) && (
								<button
									onClick={handleClearFilters}
									className="px-3 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
								>
									Clear
								</button>
							)}
						</div>
					</div>
				</div>
			</header>

			{/* Content */}
			<div className="flex-1 overflow-y-auto p-3 sm:p-4 lg:p-6">
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 lg:gap-6">
					{filteredCreators.map((creator) => (
						<CreatorCard
							key={creator._id}
							creator={creator}
							onClick={() => onCreatorClick(creator)}
						/>
					))}
				</div>

				{filteredCreators.length === 0 && (
					<div className="text-center py-12">
						<div className="text-gray-400 mb-4">
							<Users size={48} className="mx-auto" />
						</div>
						<h3 className="text-lg font-semibold text-gray-900 mb-2">
							No creators found
						</h3>
						<p className="text-gray-600">
							Try adjusting your search or filters
						</p>
						<button
							onClick={handleClearFilters}
							className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
						>
							Clear All Filters
						</button>
					</div>
				)}
			</div>
			{isMobile && <WhatsAppButton variant="floating" />}
		</div>
	);
};

export default Dashboard;
