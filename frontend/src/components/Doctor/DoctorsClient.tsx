// DoctorsClient.tsx
"use client";
import { useState, useEffect } from "react";
import { IDoctor } from "@/types/doctor.types";
import DoctorCard from "@/components/Doctor/DoctorCard";
import BackButton from "@/components/common/BackButton";
import Pagination from "@/components/common/Pagination";
import {
  searchDoctorsByName,
  getAllUniqueSpecializations,
  getDoctorsBySpecialization,
} from "@/services/doctor.client.service";

const ITEMS_PER_PAGE = 4;

export default function DoctorsClient({
  doctors: initialDoctors,
}: {
  doctors: IDoctor[];
}) {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSpecialization, setSelectedSpecialization] = useState("");
  const [specializations, setSpecializations] = useState<string[]>([]);
  const [filteredDoctors, setFilteredDoctors] = useState<IDoctor[]>(initialDoctors);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch specializations on mount
  useEffect(() => {
    const fetchSpecializations = async () => {
      try {
        const res = await getAllUniqueSpecializations();
        setSpecializations(res.data);
      } catch (error) {
        console.error("Error fetching specializations:", error);
      }
    };
    fetchSpecializations();
  }, []);

  // Handle search and filter
  useEffect(() => {
    const applyFilters = async () => {
      setIsLoading(true);
      try {
        let results = initialDoctors;

        // Apply specialization filter
        if (selectedSpecialization) {
          const res = await getDoctorsBySpecialization(selectedSpecialization);
          results = res.data;
        }

        // Apply search filter
        if (searchQuery) {
          const searchRes = await searchDoctorsByName(searchQuery);
          results = searchRes.data;

          // If both filters are applied, intersect the results
          if (selectedSpecialization) {
            results = results.filter(
              (doc) => doc.specialization === selectedSpecialization
            );
          }
        }

        setFilteredDoctors(results);
        setCurrentPage(1); // Reset to first page when filters change
      } catch (error) {
        console.error("Error applying filters:", error);
      } finally {
        setIsLoading(false);
      }
    };

    applyFilters();
  }, [searchQuery, selectedSpecialization, initialDoctors]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const totalPages = Math.ceil(filteredDoctors.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedDoctors = filteredDoctors.slice(startIndex, endIndex);

  return (
    <div className="min-h-screen bg-slate-50/50">
      <div className="mx-auto max-w-[2160px] px-4 py-8 sm:px-6 lg:px-12">
        <BackButton />
        
        {/* Header and Search Section - Side by Side */}
        <div className="mb-8 flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          {/* Left: Header */}
          <header className="flex flex-col gap-2">
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              Available Doctors
            </h1>
            <p className="text-slate-500">
              Find and book appointments with our world-class medical specialists.
            </p>
          </header>

          {/* Right: Search and Filter Section */}
          <div className="flex flex-wrap items-center gap-3 lg:flex-nowrap">
            {/* Search Bar */}
            <div className="flex w-full items-center sm:w-64">
              <input
                type="text"
                placeholder="Search doctors by name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 shadow-sm transition-colors focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="ml-2 text-slate-400 hover:text-slate-600"
                >
                  <svg
                    className="h-5 w-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              )}
            </div>

            {/* Specialization Filter */}
            <div className="flex w-full items-center sm:w-48">
              <select
                value={selectedSpecialization}
                onChange={(e) => setSelectedSpecialization(e.target.value)}
                className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900 shadow-sm transition-colors focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                <option value="">All Specializations</option>
                {specializations.map((spec) => (
                  <option key={spec} value={spec}>
                    {spec}
                  </option>
                ))}
              </select>
            </div>

            {/* Clear Filters Button */}
            {(searchQuery || selectedSpecialization) && (
              <button
                onClick={() => {
                  setSearchQuery("");
                  setSelectedSpecialization("");
                }}
                className="flex items-center gap-2 whitespace-nowrap rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm font-medium text-slate-700 shadow-sm transition-colors hover:bg-slate-50"
              >
                <svg
                  className="h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
                Clear Filters
              </button>
            )}
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex justify-center py-8">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-blue-500"></div>
          </div>
        )}

        {/* No Results */}
        {!isLoading && paginatedDoctors.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="mb-4 rounded-full bg-slate-100 p-6">
              <svg
                className="h-12 w-12 text-slate-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
            </div>
            <p className="text-center text-lg font-medium text-slate-500">
              No doctors found
            </p>
            <p className="mt-2 text-center text-sm text-slate-400">
              {searchQuery || selectedSpecialization
                ? "Try adjusting your search or filter criteria"
                : "Please check back later for available doctors"}
            </p>
          </div>
        )}

        {/* Doctors Grid */}
        {!isLoading && paginatedDoctors.length > 0 && (
          <>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5">
              {paginatedDoctors.map((doctor) => (
                <DoctorCard key={doctor.id} doctor={doctor} />
              ))}
            </div>

            {/* Pagination */}
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
              itemsPerPage={ITEMS_PER_PAGE}
              totalItems={filteredDoctors.length}
            />
          </>
        )}
      </div>
    </div>
  );
}