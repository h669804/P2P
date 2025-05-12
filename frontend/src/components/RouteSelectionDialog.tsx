import { useState, useEffect } from 'react';
import ReusableDialog from './ReusableDialog';
import '../css/components/RouteSelection.css';
import '../css/components/ApplyCancelButtons.css';

// ─────────────────────────────────────────────
// File: RouteSelectionDialog.tsx
// Component: RouteSelectionDialog
// Description: Dialogvindu som henter tilgjengelige ruter og lar bruker velge en av de
// Context: Brukes i ChooseRoute.tsx
// ─────────────────────────────────────────────

interface RouteSelectionDialogProps {
  readonly onRouteSelected: (selected: boolean) => void;
}

interface RouteStopDto {
  id: number;
  portName: string;
  arrivalTime: string; // Will be converted from ISO date
  departureTime: string; // Will be converted from ISO date
  stopOrder: number;
}

interface VoyageRouteDto {
  id: number;
  departurePort: string;
  arrivalPort: string;
  departureTime: string; // Will be converted from ISO date
  arrivalTime: string; // Will be converted from ISO date
  shipName: string;
  price: number;
  availableSeats: number;
  isActive: boolean;
  routeCode: string;
  description: string;
  stops: RouteStopDto[];
}

export default function RouteSelectionDialog({ onRouteSelected }: RouteSelectionDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedRoute, setSelectedRoute] = useState<VoyageRouteDto | null>(null);
  const [routes, setRoutes] = useState<VoyageRouteDto[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Function to format date for display
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    // Get day name shortened to 3 letters
    const dayName = new Intl.DateTimeFormat('en-US', { weekday: 'short' }).format(date);
    // Get day of month
    const day = date.getDate();
    // Get month name shortened to 3 letters
    const month = new Intl.DateTimeFormat('en-US', { month: 'short' }).format(date);
    // Get hours and minutes
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');

    return `${dayName} ${day} ${month} ${hours}:${minutes}`;
  };

  // Fetch routes data from API
  useEffect(() => {
    const selectedRoute = sessionStorage.getItem('selectedRoute');
    if (selectedRoute) {
      setSelectedRoute(JSON.parse(selectedRoute));
      onRouteSelected(true);
    }
    const fetchRoutes = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Retrieve stored navigation information
        const departurePort = sessionStorage.getItem('departurePort');
        const destinationPort = sessionStorage.getItem('destinationPort');
        const selectedDate = sessionStorage.getItem('selectedDate');

        // Validate required parameters
        if (!departurePort || !destinationPort || !selectedDate) {
          throw new Error('Missing travel information. Please complete previous steps.');
        }

        // Build the URL with parameters
        const url = `http://localhost:5215/api/Routes/search?departure=${encodeURIComponent(departurePort)}&arrival=${encodeURIComponent(destinationPort)}&date=${encodeURIComponent(selectedDate)}`;

        const response = await fetch(url, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          // Try to get error details
          const errorText = await response.text();
          throw new Error(`HTTP error! Status: ${response.status}, Message: ${errorText}`);
        }

        const data = await response.json();

        setRoutes(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load routes. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchRoutes();
  }, []);

  const handleSelect = (route: VoyageRouteDto) => {
    setSelectedRoute(route);
  };

  const handleApply = () => {
    if (selectedRoute) {
      onRouteSelected(true);
      // Store the selected route in sessionStorage
      sessionStorage.setItem('selectedRoute', JSON.stringify(selectedRoute));
      setIsOpen(false);
    }
  };

  const getDisplayText = () => {
    if (!selectedRoute) return 'View voyages';
    return `${formatDate(selectedRoute.departureTime)}`;
  };

  let content: React.ReactNode;

  if (isLoading) {
    content = <div className="loading-state">Loading available routes...</div>;
  } else if (error) {
    content = <div className="error-state">{error}</div>;
  } else if (routes.length === 0) {
    content = <div className="no-routes">No routes found for this journey.</div>;
  } else {
    content = routes.map((route) => (
      <button
        key={route.id}
        className={`route-option ${!route.isActive ? 'unavailable' : ''} ${
          selectedRoute?.id === route.id ? 'selected' : ''
        }`}
        onClick={() => route.isActive && handleSelect(route)}
      >
        <div className="route-header">
          <div className="route-title">
            {route.departurePort} → {route.arrivalPort}
          </div>
          <div className="ship-name">{route.shipName}</div>
        </div>
        <div className="route-details">
          <div className="route-times">
            <div className="time-item">
              <span className="time-label">Departure:</span>
              <span className="time-value">{formatDate(route.departureTime)}</span>
            </div>
            <div className="time-item">
              <span className="time-label">Arrival:</span>
              <span className="time-value">{formatDate(route.arrivalTime)}</span>
            </div>
          </div>
          <div className="route-price">NOK {Math.round(route.price)}</div>
        </div>
      </button>
    ));
  }

  return (
    <div className="custom-route-dialog">
      <button className="custom-route-dialog-toggle" onClick={() => setIsOpen(true)} type="button">
        <p>{getDisplayText()}</p>
      </button>
      <ReusableDialog
        className="custom-route-dialog-open"
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
      >
        <div className="custom-route-dialog-content">
          {content}
          <div className="apply-cancel">
            <button className="cancel" onClick={() => setIsOpen(false)}>
              Cancel
            </button>
            <button className="apply" onClick={handleApply} disabled={!selectedRoute}>
              Apply
            </button>
          </div>
        </div>
      </ReusableDialog>
    </div>
  );
}
