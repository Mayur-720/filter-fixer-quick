
import React, { useState, useEffect } from "react";
import CreatorCard from "./CreatorCard";
import WhatsAppButton from "./WhatsAppButton";
import FilterDialog from "./FilterDialog";
import { Creator } from "../types/Creator";
import { creatorAPI } from "../services/api";
import { Users, Search, Filter } from "lucide-react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Skeleton } from "./ui/skeleton";
import { useIsMobile } from "@/hooks/use-mobile";

interface DashboardProps {
	activeGenre: string;
	onCreatorClick: (creator: Creator) => void;
}

interface FilterState {
	platform: string;
	location: string;
	priceRange: [number, number];
	followersRange: [number, number];
}

const Dashboard: React.FC<DashboardProps> = ({
	activeGenre,
	onCreatorClick,
}) => {
	const [creators, setCreators] = useState<Creator[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [searchTerm, setSearchTerm] = useState("");
	const [isFilterDialogOpen, setIsFilterDialogOpen] = useState(false);
	const [filters, setFilters] = useState<FilterState>({
		platform: "All",
		location: "All",
		priceRange: [0, 10000],
		followersRange: [0, 1000],
	});
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

	// Filter creators based on search and filters
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
		if (filters.platform !== "All") {
			filteredCreators = filteredCreators.filter(
				(creator) => creator.platform === filters.platform
			);
		}

		// Apply location filter
		if (filters.location !== "All") {
			filteredCreators = filteredCreators.filter((creator) => {
				const creatorLocation = creator.location || creator.details?.location || "";
				return creatorLocation === filters.location;
			});
		}

		// Apply price range filter
		filteredCreators = filteredCreators.filter((creator) => {
			const pricing = creator.details?.pricing || "₹0";
			const priceMatch = pricing.match(/₹(\d+)/);
			const price = priceMatch ? parseInt(priceMatch[1]) : 0;
			return price >= filters.priceRange[0] && price <= filters.priceRange[1];
		});

		// Apply followers range filter
		filteredCreators = filteredCreators.filter((creator) => {
			const followers = creator.details?.analytics?.followers || 0;
			const followersInK = followers / 1000;
			return followersInK >= filters.followersRange[0] && followersInK <= filters.followersRange[1];
		});

		return filteredCreators;
	};

	const filteredCreators = getFilteredCreators();

	const handleClearFilters = () => {
		setFilters({
			platform: "All",
			location: "All",
			priceRange: [0, 10000],
			followersRange: [0, 1000],
		});
		setSearchTerm("");
	};

	const hasActiveFilters = 
		filters.platform !== "All" ||
		filters.location !== "All" ||
		filters.priceRange[0] !== 0 ||
		filters.priceRange[1] !== 10000 ||
		filters.followersRange[0] !== 0 ||
		filters.followersRange[1] !== 1000 ||
		searchTerm !== "";

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
							<Skeleton className="h-10 w-24" />
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

					{/* Search and Filter */}
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

						<div className="flex items-center gap-2">
							<Button
								variant="outline"
								onClick={() => setIsFilterDialogOpen(true)}
								className="flex items-center gap-2"
							>
								<Filter className="h-4 w-4" />
								Filters
								{hasActiveFilters && (
									<span className="bg-purple-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
										!
									</span>
								)}
							</Button>

							{hasActiveFilters && (
								<Button
									variant="ghost"
									size="sm"
									onClick={handleClearFilters}
									className="text-red-500 hover:text-red-700"
								>
									Clear
								</Button>
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
						<Button
							onClick={handleClearFilters}
							className="mt-4"
							variant="outline"
						>
							Clear All Filters
						</Button>
					</div>
				)}
			</div>

			{/* Filter Dialog */}
			<FilterDialog
				isOpen={isFilterDialogOpen}
				onClose={() => setIsFilterDialogOpen(false)}
				filters={filters}
				onFiltersChange={setFilters}
				onClearFilters={handleClearFilters}
			/>

			{isMobile && <WhatsAppButton variant="floating" />}
		</div>
	);
};

export default Dashboard;
