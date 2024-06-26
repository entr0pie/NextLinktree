"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import ResultCard from "./result-card/ResultCard";
import { useState } from "react";
import { search, PublicUserProfile, searchWithDates } from './search-service/SearchService';
import { CalendarButton } from "./calendar-button/CalendarButton";

export default function SearchBox() {
    const [profiles, setProfiles] = useState<PublicUserProfile[]>([]);
    const [keyword, setKeyword] = useState("");

    /**
     * Render the input for the search. Contains the logic for the API Querying.
     * 
     * @returns {JSX.Element} The search bar. 
     */
    function renderSearchBar() {

        const [startDate, setStartDate] = useState<Date | undefined>(undefined);
        const [endDate, setEndDate] = useState<Date | undefined>(undefined);

        const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
            const value = e.target.value;
            setKeyword(value);

            setTimeout(() => {
                if (value !== "") {
                    search(value).then((data) => {
                        setProfiles(data);
                    });
                } else {
                    setProfiles([]);
                }
            }, 200);
        };

        const handleStartDate = (d: Date | undefined) => {
            d = d ? d : new Date('2000-01-01');
            const end = endDate ? endDate : new Date();

            setStartDate(d);
            setTimeout(() => {
                searchWithDates(keyword, d, end).then((data) => {
                    setProfiles(data);
                });
            }, 200);
        };

        const handleEndDate = (d: Date | undefined) => {
            d = d ? d : new Date();
            const start = startDate ? startDate : new Date('2000-01-01');

            setEndDate(d);
            setTimeout(() => {
                searchWithDates(keyword, start, d).then((data) => {
                    setProfiles(data);
                });
            }, 200);
        };

        return (
            <div className="w-full flex items-center space-x-2">
                <Input type="text" value={keyword} placeholder="Search here..." onChange={(e) => handleInput(e)}></Input>
                <CalendarButton label="Start" onDatePick={handleStartDate} />
                <CalendarButton label="End" onDatePick={handleEndDate} />
            </div>
        );
    }

    /**
     * Renders the result card.
     * 
     * @returns {JSX.Element} The result card.
     */
    function renderResultCard() {
        const defaultState = {
            message: "No results found.",
            description: "Try searching for something else.",
        }

        return (
            <div className="w-full mt-6 h-80 overflow-y-scroll">
                <ResultCard profiles={profiles} defaultText={{ ...defaultState }}></ResultCard>
            </div >
        );
    }

    return (
        <div className="flex flex-col space-y-5 p-4 w-full">
            <Card className="w-full">
                <CardHeader>
                    <CardTitle>Search everything.</CardTitle>
                    <CardDescription>What tree should the universe show you?</CardDescription>
                </CardHeader>
                <CardContent>
                    {renderSearchBar()}
                    {renderResultCard()}
                </CardContent>
            </Card>
        </div>
    );
}