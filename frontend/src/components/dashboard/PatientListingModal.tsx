// components/dashboard/PatientListingModal.tsx
"use client";
import { useState } from "react";
import { PatientListingResponse } from "@/types/doctorAnalytics.types";
import { X, Search, User, Mail, Phone, Calendar, Filter } from "lucide-react";

interface PatientListingModalProps {
    patients: PatientListingResponse[];
}

export default function PatientListingModal({
    patients,
}: PatientListingModalProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [genderFilter, setGenderFilter] = useState<string>("all");

    const filteredPatients = patients.filter((patient) => {
        const matchesSearch =
            patient.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            patient.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (patient.phone && patient.phone.includes(searchTerm));

        const matchesGender =
            genderFilter === "all" || patient.gender === genderFilter;

        return matchesSearch && matchesGender;
    });

    const formatDate = (date?: Date) => {
        if (!date) return "N/A";
        return new Date(date).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    };

    const calculateAge = (dob?: Date) => {
        if (!dob) return "N/A";
        const today = new Date();
        const birthDate = new Date(dob);
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        if (
            monthDiff < 0 ||
            (monthDiff === 0 && today.getDate() < birthDate.getDate())
        ) {
            age--;
        }
        return age;
    };

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white px-6 py-3 rounded-lg font-medium shadow-md hover:shadow-lg transition-all duration-200 flex items-center gap-2 hover:scale-105"
            >
                <User className="w-5 h-5" />
                View Your Patients ({patients.length})
            </button>

            {isOpen && (
                <div className="fixed inset-0 z-50 overflow-hidden animate-fadeIn">
                    <div className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm" />

                    <div className="absolute inset-0 overflow-hidden">
                        <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10 sm:pl-16">
                            <div className="pointer-events-auto w-screen max-w-6xl transform transition-all duration-300 ease-in-out animate-slideInRight">
                                <div className="flex h-full flex-col bg-white shadow-xl">
                                    {/* Header */}
                                    <div className="bg-gradient-to-r from-blue-500 to-indigo-500 px-6 py-6">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className="bg-white p-2 rounded-lg shadow-sm">
                                                    <User className="w-6 h-6 text-blue-600" />
                                                </div>

                                                <div>
                                                    <h2 className="text-2xl font-bold text-white">
                                                        Patient Directory
                                                    </h2>
                                                    <p className="text-blue-100 text-sm">
                                                        {filteredPatients.length} of {patients.length} patients
                                                    </p>
                                                </div>
                                            </div>

                                            {/* FIXED CLOSE BUTTON */}
                                            <button
                                                onClick={() => setIsOpen(false)}
                                                className="bg-white text-gray-800 rounded-lg p-2 shadow-md hover:bg-gray-100 transition-all"
                                                aria-label="Close"
                                            >
                                                <X className="w-6 h-6" />
                                            </button>
                                        </div>

                                        {/* Search and Filter */}
                                        <div className="mt-6 flex flex-col sm:flex-row gap-3">
                                            <div className="flex-1 relative">
                                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                                <input
                                                    type="text"
                                                    placeholder="Search by name, email, or phone..."
                                                    value={searchTerm}
                                                    onChange={(e) => setSearchTerm(e.target.value)}
                                                    className="w-full pl-10 pr-4 py-3 rounded-lg bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50"
                                                />
                                            </div>
                                            <div className="relative">
                                                <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                                <select
                                                    value={genderFilter}
                                                    onChange={(e) => setGenderFilter(e.target.value)}
                                                    className="pl-10 pr-8 py-3 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50 appearance-none cursor-pointer"
                                                >
                                                    <option value="all">All Genders</option>
                                                    <option value="MALE">Male</option>
                                                    <option value="FEMALE">Female</option>
                                                    <option value="OTHER">Other</option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Patient List */}
                                    <div className="flex-1 overflow-y-auto p-6">
                                        {filteredPatients.length === 0 ? (
                                            <div className="flex flex-col items-center justify-center h-full text-gray-500">
                                                <User className="w-16 h-16 mb-4 text-gray-300" />
                                                <p className="text-lg font-medium">No patients found</p>
                                                <p className="text-sm">
                                                    Try adjusting your search or filters
                                                </p>
                                            </div>
                                        ) : (
                                            <div className="overflow-x-auto">
                                                <table className="w-full">
                                                    <thead>
                                                        <tr className="border-b-2 border-gray-200">
                                                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                                                                Patient Info
                                                            </th>
                                                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                                                                Contact
                                                            </th>
                                                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                                                                Gender
                                                            </th>
                                                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                                                                Age
                                                            </th>
                                                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                                                                Date of Birth
                                                            </th>
                                                        </tr>
                                                    </thead>
                                                    <tbody className="divide-y divide-gray-200">
                                                        {filteredPatients.map((patient, index) => (
                                                            <tr
                                                                key={patient.patientId}
                                                                className="hover:bg-blue-50 transition-colors animate-fadeIn"
                                                                style={{ animationDelay: `${index * 50}ms` }}
                                                            >
                                                                <td className="px-4 py-4">
                                                                    <div className="flex items-center gap-3">
                                                                        <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-full flex items-center justify-center text-white font-semibold">
                                                                            {patient.fullName.charAt(0).toUpperCase()}
                                                                        </div>
                                                                        <div>
                                                                            <p className="font-semibold text-gray-900">
                                                                                {patient.fullName}
                                                                            </p>
                                                                        </div>
                                                                    </div>
                                                                </td>
                                                                <td className="px-4 py-4">
                                                                    <div className="space-y-1">
                                                                        <div className="flex items-center gap-2 text-sm">
                                                                            <Mail className="w-4 h-4 text-gray-400" />
                                                                            {patient.email}
                                                                        </div>
                                                                        {patient.phone && (
                                                                            <div className="flex items-center gap-2 text-sm">
                                                                                <Phone className="w-4 h-4 text-gray-400" />
                                                                                {patient.phone}
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                </td>
                                                                <td className="px-4 py-4">
                                                                    <span className="inline-flex px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                                                        {patient.gender}
                                                                    </span>
                                                                </td>
                                                                <td className="px-4 py-4">
                                                                    {calculateAge(patient.dateOfBirth)} years
                                                                </td>
                                                                <td className="px-4 py-4 flex items-center gap-2">
                                                                    <Calendar className="w-4 h-4 text-gray-400" />
                                                                    {formatDate(patient.dateOfBirth)}
                                                                </td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
