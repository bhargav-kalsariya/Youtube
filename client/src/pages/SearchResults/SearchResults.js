import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSearchParams, useNavigate } from 'react-router-dom';
import VideoGrid from '../../components/VideoGrid/VideoGrid';
import Header from '../../components/Header/Header';
import SideBar from '../../components/SideBar/SideBar';
import { searchVideos } from '../../redux/slices/feedSlice';
import { FaFilter, FaSort } from 'react-icons/fa';
import './SearchResults.scss';
import { useSidebar } from '../../context/SidebarContext';

function SearchResults() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();
    const { searchResults, loading } = useSelector((state) => state.feedReducer);
    const { isSidebarOpen } = useSidebar();

    const [filters, setFilters] = useState({
        sortBy: searchParams.get('sortBy') || 'relevance',
        duration: searchParams.get('duration') || '',
        date: searchParams.get('date') || ''
    });

    const [showFilters, setShowFilters] = useState(false);
    const query = searchParams.get('q');

    useEffect(() => {
        if (query) {
            const searchParams = { query, ...filters };
            dispatch(searchVideos(searchParams));
        }
    }, [dispatch, query, filters]);

    const handleFilterChange = (filterType, value) => {
        const newFilters = { ...filters, [filterType]: value };
        setFilters(newFilters);

        // Update URL params
        const newSearchParams = new URLSearchParams(searchParams);
        newSearchParams.set(filterType, value);
        setSearchParams(newSearchParams);
    };

    const clearFilters = () => {
        setFilters({
            sortBy: 'relevance',
            duration: '',
            date: ''
        });
        setSearchParams({ q: query });
    };

    if (!query) {
        navigate('/');
        return null;
    }

    return (
        <div className="search-results-page">
            <Header />
            <div className={`main-content ${isSidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
                <SideBar />
                <div className="search-content">
                    <div className="search-header">
                        <h1>Search Results for "{query}"</h1>
                        <div className="search-actions">
                            <button
                                className="filter-toggle"
                                onClick={() => setShowFilters(!showFilters)}
                            >
                                <FaFilter /> Filters
                            </button>
                            <button className="sort-toggle">
                                <FaSort /> Sort
                            </button>
                        </div>
                    </div>

                    {showFilters && (
                        <div className="filters-panel">
                            <div className="filter-group">
                                <label>Sort by:</label>
                                <select
                                    value={filters.sortBy}
                                    onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                                >
                                    <option value="relevance">Relevance</option>
                                    <option value="date">Upload date</option>
                                    <option value="views">View count</option>
                                    <option value="rating">Rating</option>
                                </select>
                            </div>

                            <div className="filter-group">
                                <label>Duration:</label>
                                <select
                                    value={filters.duration}
                                    onChange={(e) => handleFilterChange('duration', e.target.value)}
                                >
                                    <option value="">Any duration</option>
                                    <option value="short">Under 4 minutes</option>
                                    <option value="medium">4-20 minutes</option>
                                    <option value="long">Over 20 minutes</option>
                                </select>
                            </div>

                            <div className="filter-group">
                                <label>Upload date:</label>
                                <select
                                    value={filters.date}
                                    onChange={(e) => handleFilterChange('date', e.target.value)}
                                >
                                    <option value="">Any time</option>
                                    <option value="hour">Past hour</option>
                                    <option value="today">Today</option>
                                    <option value="week">This week</option>
                                    <option value="month">This month</option>
                                    <option value="year">This year</option>
                                </select>
                            </div>

                            <button className="clear-filters" onClick={clearFilters}>
                                Clear filters
                            </button>
                        </div>
                    )}

                    <div className="results-info">
                        {loading ? (
                            <p>Searching...</p>
                        ) : (
                            <p>{searchResults.length} results found</p>
                        )}
                    </div>

                    <div className="search-video-grid">
                        {searchResults.length > 0 ? (
                            <VideoGrid videos={searchResults} />
                        ) : !loading ? (
                            <div className="no-results">
                                <h2>No videos found</h2>
                                <p>Try adjusting your search terms or filters</p>
                            </div>
                        ) : null}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default SearchResults; 