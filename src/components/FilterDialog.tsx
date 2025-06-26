import React from "react";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogDescription,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "./ui/select";
import { Slider } from "./ui/slider";
import { X, MapPin, DollarSign, Users, Monitor } from "lucide-react";

interface FilterState {
	platform: string;
	location: string;
	priceRange: [number, number];
	followersRange: [number, number];
}

interface FilterDialogProps {
	isOpen: boolean;
	onClose: () => void;
	filters: FilterState;
	onFiltersChange: (filters: FilterState) => void;
	onClearFilters: () => void;
}

const majorIndianCities = [
	"All",
	"Mumbai",
	"Delhi",
	"Bangalore",
	"Chennai",
	"Kolkata",
	"Hyderabad",
	"Pune",
	"Ahmedabad",
	"Jaipur",
	"Lucknow",
	"Kanpur",
	"Nagpur",
	"Indore",
	"Thane",
	"Bhopal",
	"Visakhapatnam",
	"Pimpri-Chinchwad",
	"Patna",
	"Vadodara",
	"Ghaziabad",
	"Ludhiana",
	"Agra",
	"Nashik",
	"Faridabad",
	"Meerut",
	"Rajkot",
	"Kalyan-Dombivli",
	"Vasai-Virar",
	"Varanasi",
	"Srinagar",
	"Aurangabad",
	"Dhanbad",
	"Amritsar",
	"Navi Mumbai",
	"Allahabad",
	"Ranchi",
	"Howrah",
	"Coimbatore",
	"Jabalpur",
	"Gwalior",
	"Vijayawada",
	"Jodhpur",
	"Madurai",
	"Raipur",
	"Kota",
	"Guwahati",
	"Chandigarh",
	"Solapur",
	"Hubli-Dharwad",
	"Bareilly",
	"Moradabad",
	"Mysore",
	"Gurgaon",
	"Aligarh",
	"Jalandhar",
	"Tiruchirappalli",
	"Bhubaneswar",
	"Salem",
	"Mira-Bhayandar",
	"Warangal",
	"Thiruvananthapuram",
	"Guntur",
	"Bhiwandi",
	"Saharanpur",
	"Gorakhpur",
	"Bikaner",
	"Amravati",
	"Noida",
	"Jamshedpur",
	"Bhilai Nagar",
	"Cuttack",
	"Firozabad",
	"Kochi",
	"Nellore",
	"Bhavnagar",
	"Dehradun",
	"Durgapur",
	"Asansol",
	"Rourkela",
	"Nanded",
	"Kolhapur",
	"Ajmer",
	"Akola",
	"Gulbarga",
	"Jamnagar",
	"Ujjain",
	"Loni",
	"Siliguri",
	"Jhansi",
	"Ulhasnagar",
	"Jammu",
	"Sangli-Miraj & Kupwad",
	"Mangalore",
	"Erode",
	"Belgaum",
	"Ambattur",
	"Tirunelveli",
	"Malegaon",
	"Gaya",
	"Jalgaon",
	"Udaipur",
	"Maheshtala",
	"USA",
	"Canada",
	"UK",
	"Australia",
	"Germany",
	"France",
	"Japan",
	"South Korea",
	"Singapore",
	"New Zealand",
	"Spain",
];

const platforms = [
	"All",
	"Instagram",
	"YouTube",
	"TikTok",
	"Twitter",
	"LinkedIn",
];

const FilterDialog: React.FC<FilterDialogProps> = ({
	isOpen,
	onClose,
	filters,
	onFiltersChange,
	onClearFilters,
}) => {
	const handleFilterChange = (key: keyof FilterState, value: any) => {
		onFiltersChange({
			...filters,
			[key]: value,
		});
	};

	const hasActiveFilters =
		filters.platform !== "All" ||
		filters.location !== "All" ||
		filters.priceRange[0] !== 0 ||
		filters.priceRange[1] !== 10000 ||
		filters.followersRange[0] !== 0 ||
		filters.followersRange[1] !== 1000;

	const formatPrice = (price: number) => {
		if (price >= 1000) {
			return `₹${(price / 1000).toFixed(0)}K`;
		}
		return `₹${price}`;
	};

	const formatFollowers = (followers: number) => {
		if (followers >= 1000) {
			return `${(followers / 1000).toFixed(0)}M`;
		}
		return `${followers}K`;
	};

	return (
		<Dialog open={isOpen} onOpenChange={onClose}>
			<DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
				<DialogHeader>
					<DialogTitle className="flex items-center gap-2">
						<Monitor className="h-5 w-5 text-purple-600" />
						Filter Creators
					</DialogTitle>
					<DialogDescription>
						Filter creators by platform, location, price range, and follower
						count
					</DialogDescription>
				</DialogHeader>

				<div className="space-y-6 py-4">
					{/* Platform Filter */}
					<div className="space-y-2">
						<Label className="flex items-center gap-2 text-sm font-medium">
							<Monitor className="h-4 w-4 text-blue-500" />
							Platform
						</Label>
						<Select
							value={filters.platform}
							onValueChange={(value) => handleFilterChange("platform", value)}
						>
							<SelectTrigger>
								<SelectValue placeholder="Select platform" />
							</SelectTrigger>
							<SelectContent>
								{platforms.map((platform) => (
									<SelectItem key={platform} value={platform}>
										{platform}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>

					{/* Location Filter */}
					<div className="space-y-2">
						<Label className="flex items-center gap-2 text-sm font-medium">
							<MapPin className="h-4 w-4 text-green-500" />
							Location (Major Indian Cities)
						</Label>
						<Select
							value={filters.location}
							onValueChange={(value) => handleFilterChange("location", value)}
						>
							<SelectTrigger>
								<SelectValue placeholder="Select location" />
							</SelectTrigger>
							<SelectContent className="max-h-60">
								{majorIndianCities.map((city) => (
									<SelectItem key={city} value={city}>
										{city}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>

					{/* Price Range Filter */}
					<div className="space-y-4">
						<Label className="flex items-center gap-2 text-sm font-medium">
							<DollarSign className="h-4 w-4 text-yellow-500" />
							Price Range
						</Label>
						<div className="px-3">
							<Slider
								value={filters.priceRange}
								onValueChange={(value) =>
									handleFilterChange("priceRange", value as [number, number])
								}
								max={10000}
								min={0}
								step={500}
								className="w-full"
							/>
							<div className="flex justify-between items-center mt-2 text-sm text-gray-600">
								<span className="font-medium">
									{formatPrice(filters.priceRange[0])}
								</span>
								<span className="text-gray-400">to</span>
								<span className="font-medium">
									{formatPrice(filters.priceRange[1])}
								</span>
							</div>
						</div>
					</div>

					{/* Followers Range Filter */}
					<div className="space-y-4">
						<Label className="flex items-center gap-2 text-sm font-medium">
							<Users className="h-4 w-4 text-purple-500" />
							Followers Range
						</Label>
						<div className="px-3">
							<Slider
								value={filters.followersRange}
								onValueChange={(value) =>
									handleFilterChange(
										"followersRange",
										value as [number, number]
									)
								}
								max={1000}
								min={0}
								step={50}
								className="w-full"
							/>
							<div className="flex justify-between items-center mt-2 text-sm text-gray-600">
								<span className="font-medium">
									{formatFollowers(filters.followersRange[0])}
								</span>
								<span className="text-gray-400">to</span>
								<span className="font-medium">
									{formatFollowers(filters.followersRange[1])}
								</span>
							</div>
						</div>
					</div>

					{/* Active Filters Summary */}
					{hasActiveFilters && (
						<div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
							<h4 className="font-medium text-purple-800 mb-2 text-sm">
								Active Filters:
							</h4>
							<div className="flex flex-wrap gap-2">
								{filters.platform !== "All" && (
									<span className="bg-purple-100 text-purple-700 px-2 py-1 rounded-full text-xs">
										{filters.platform}
									</span>
								)}
								{filters.location !== "All" && (
									<span className="bg-purple-100 text-purple-700 px-2 py-1 rounded-full text-xs">
										{filters.location}
									</span>
								)}
								{(filters.priceRange[0] !== 0 ||
									filters.priceRange[1] !== 10000) && (
									<span className="bg-purple-100 text-purple-700 px-2 py-1 rounded-full text-xs">
										{formatPrice(filters.priceRange[0])} -{" "}
										{formatPrice(filters.priceRange[1])}
									</span>
								)}
								{(filters.followersRange[0] !== 0 ||
									filters.followersRange[1] !== 1000) && (
									<span className="bg-purple-100 text-purple-700 px-2 py-1 rounded-full text-xs">
										{formatFollowers(filters.followersRange[0])} -{" "}
										{formatFollowers(filters.followersRange[1])} followers
									</span>
								)}
							</div>
						</div>
					)}
				</div>

				{/* Dialog Footer */}
				<div className="flex flex-col sm:flex-row gap-2 pt-4 border-t">
					<Button
						variant="outline"
						onClick={onClearFilters}
						className="flex-1 sm:flex-none"
						disabled={!hasActiveFilters}
					>
						<X className="h-4 w-4 mr-2" />
						Clear All
					</Button>
					<Button onClick={onClose} className="flex-1">
						Apply Filters
					</Button>
				</div>
			</DialogContent>
		</Dialog>
	);
};

export default FilterDialog;
