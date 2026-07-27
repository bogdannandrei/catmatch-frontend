import { type FormEvent, useEffect, useState } from "react";
import {
    discoverCatProfiles,
    getMyCatProfiles,
    type CatGender,
    type CatProfileResponse,
    type DiscoverCatProfilesFilters,
} from "../api/catProfilesApi";
import {
    createCatSwipe,
    type CatSwipeDecision,
    undoCatSwipe,
} from "../api/catSwipesApi";

const DISCOVER_LIMIT = 20;
const REFILL_THRESHOLD = 5;

type LastSwipe = {
    swiperCatProfileId: number;
    targetCat: CatProfileResponse;
    decision: CatSwipeDecision;
};

type DiscoverFilterForm = {
    city: string;
    country: string;
    breed: string;
    gender: CatGender | "";
};

const EMPTY_FILTERS: DiscoverFilterForm = {
    city: "",
    country: "",
    breed: "",
    gender: "",
};

export function useDiscoverCats() {
    const [myCats, setMyCats] = useState<CatProfileResponse[]>([]);
    const [cats, setCats] = useState<CatProfileResponse[]>([]);
    const [selectedSwiperCatId, setSelectedSwiperCatId] = useState<number | null>(null);

    const [filterForm, setFilterForm] = useState<DiscoverFilterForm>(EMPTY_FILTERS);
    const [appliedFilters, setAppliedFilters] = useState<DiscoverFilterForm>(EMPTY_FILTERS);

    const [isLoading, setIsLoading] = useState(true);
    const [isLoadingDiscover, setIsLoadingDiscover] = useState(false);
    const [isRefilling, setIsRefilling] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [swipingCatId, setSwipingCatId] = useState<number | null>(null);
    const [matchMessage, setMatchMessage] = useState<string | null>(null);
    const [matchedCat, setMatchedCat] = useState<CatProfileResponse | null>(null);
    const [lastSwipe, setLastSwipe] = useState<LastSwipe | null>(null);
    const [isUndoing, setIsUndoing] = useState(false);

    const hasActiveFilters = hasFilters(appliedFilters);

    useEffect(() => {
        async function loadMyCats() {
            try {
                setIsLoading(true);
                setErrorMessage(null);

                const myCatProfiles = await getMyCatProfiles();

                setMyCats(myCatProfiles);

                if (myCatProfiles.length > 0) {
                    setSelectedSwiperCatId(myCatProfiles[0].id);
                }
            } catch (error) {
                console.error("Failed to load my cats:", error);
                setErrorMessage("Could not load your cats.");
            } finally {
                setIsLoading(false);
            }
        }

        loadMyCats();
    }, []);

    useEffect(() => {
        async function loadDiscoverCats() {
            if (!selectedSwiperCatId) {
                setCats([]);
                setLastSwipe(null);
                setMatchedCat(null);
                return;
            }

            try {
                setIsLoadingDiscover(true);
                setErrorMessage(null);
                setMatchMessage(null);
                setMatchedCat(null);
                setLastSwipe(null);

                const discoverableCats = await discoverCatProfiles(
                    selectedSwiperCatId,
                    DISCOVER_LIMIT,
                    appliedFilters
                );

                setCats(discoverableCats);
            } catch (error) {
                console.error("Failed to load discover cats:", error);
                setErrorMessage("Could not load discover cats.");
            } finally {
                setIsLoadingDiscover(false);
            }
        }

        loadDiscoverCats();
    }, [selectedSwiperCatId, appliedFilters]);

    function updateFilter<K extends keyof DiscoverFilterForm>(
        field: K,
        value: DiscoverFilterForm[K]
    ) {
        setFilterForm((currentFilters) => ({
            ...currentFilters,
            [field]: value,
        }));
    }

    function handleApplyFilters(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        setAppliedFilters({
            city: filterForm.city.trim(),
            country: filterForm.country.trim(),
            breed: filterForm.breed.trim(),
            gender: filterForm.gender,
        });
    }

    function handleClearFilters() {
        setFilterForm(EMPTY_FILTERS);
        setAppliedFilters(EMPTY_FILTERS);
    }

    async function handleSwipe(targetCatProfileId: number, decision: CatSwipeDecision) {
        if (!selectedSwiperCatId) {
            setErrorMessage("Select one of your cats before swiping.");
            return;
        }

        const swipedCat = cats.find((cat) => cat.id === targetCatProfileId);

        try {
            setSwipingCatId(targetCatProfileId);
            setErrorMessage(null);
            setMatchMessage(null);

            const swipeResponse = await createCatSwipe({
                swiperCatProfileId: selectedSwiperCatId,
                targetCatProfileId,
                decision,
            });

            if (swipedCat) {
                setLastSwipe({
                    swiperCatProfileId: selectedSwiperCatId,
                    targetCat: swipedCat,
                    decision,
                });
            }

            const remainingCats = cats.filter((cat) => cat.id !== targetCatProfileId);

            setCats(remainingCats);

            if (swipeResponse.matched && swipedCat) {
                setMatchedCat(swipedCat);
            }

            if (remainingCats.length <= REFILL_THRESHOLD) {
                await refillDiscoverCats(selectedSwiperCatId, remainingCats);
            }
        } catch (error) {
            console.error("Failed to swipe cat profile:", error);
            setErrorMessage("Could not save your swipe.");
        } finally {
            setSwipingCatId(null);
        }
    }

    async function handleUndoLastSwipe() {
        if (!lastSwipe) {
            return;
        }

        try {
            setIsUndoing(true);
            setErrorMessage(null);
            setMatchMessage(null);
            setMatchedCat(null);

            await undoCatSwipe(
                lastSwipe.swiperCatProfileId,
                lastSwipe.targetCat.id
            );

            setCats((currentCats) => [
                lastSwipe.targetCat,
                ...currentCats.filter((cat) => cat.id !== lastSwipe.targetCat.id),
            ]);

            setLastSwipe(null);
        } catch (error) {
            console.error("Failed to undo swipe:", error);
            setErrorMessage("Could not undo last swipe.");
        } finally {
            setIsUndoing(false);
        }
    }

    function handleCloseMatchAnimation() {
        setMatchedCat(null);
    }

    async function refillDiscoverCats(
        swiperCatProfileId: number,
        currentCats: CatProfileResponse[]
    ) {
        try {
            setIsRefilling(true);

            const newCats = await discoverCatProfiles(
                swiperCatProfileId,
                DISCOVER_LIMIT,
                appliedFilters
            );

            setCats((latestCats) => mergeUniqueCats(latestCats, newCats, currentCats));
        } catch (error) {
            console.error("Failed to refill discover cats:", error);
        } finally {
            setIsRefilling(false);
        }
    }

    return {
        myCats,
        cats,
        selectedSwiperCatId,
        setSelectedSwiperCatId,

        filterForm,
        updateFilter,
        handleApplyFilters,
        handleClearFilters,
        hasActiveFilters,

        isLoading,
        isLoadingDiscover,
        isRefilling,
        errorMessage,
        swipingCatId,
        matchMessage,
        matchedCat,
        lastSwipe,
        isUndoing,

        handleSwipe,
        handleUndoLastSwipe,
        handleCloseMatchAnimation,
    };
}

function mergeUniqueCats(
    latestCats: CatProfileResponse[],
    newCats: CatProfileResponse[],
    fallbackCurrentCats: CatProfileResponse[]
): CatProfileResponse[] {
    const baseCats = latestCats.length > 0 ? latestCats : fallbackCurrentCats;
    const existingIds = new Set(baseCats.map((cat) => cat.id));

    const uniqueNewCats = newCats.filter((cat) => !existingIds.has(cat.id));

    return [...baseCats, ...uniqueNewCats];
}

function hasFilters(filters: DiscoverCatProfilesFilters): boolean {
    return Boolean(
        filters.city
        || filters.country
        || filters.breed
        || filters.gender
    );
}