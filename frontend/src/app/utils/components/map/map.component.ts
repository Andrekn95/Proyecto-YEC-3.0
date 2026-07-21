import { Component, EventEmitter, input, Input, OnChanges, OnInit, output, Output, SimpleChanges } from '@angular/core';
import { PrimeIcons } from 'primeng/api';
import { GoogleMapsModule } from '@angular/google-maps';

interface Coordinate {
    lat: number;
    lng: number;
}

@Component({
    selector: 'app-map',
    templateUrl: './map.component.html',
    styleUrls: ['./map.component.scss'],
    imports: [GoogleMapsModule],
    standalone: true
})
export class MapComponent implements OnInit, OnChanges {
    latitude = input<number>(-0.22985);
    longitude = input<number>(-78.52495);
    dataOut = output<Coordinate>();

    protected zoom = 15;
    protected center: Coordinate = { lat: -0.22985, lng: -78.52495 };
    protected markerPosition: Coordinate = { lat: -0.22985, lng: -78.52495 };
    protected apiLoaded = false;

    constructor() {}

    ngOnInit(): void {
        if (!this.apiLoaded) {
            const script = document.createElement('script');
            script.src = 'https://maps.googleapis.com/maps/api/js?key=AIzaSyCGUwCcM-LKjRK4rjbBJ06_GLmX2LaYzfg';
            script.async = true;
            script.defer = true;
            script.onload = () => {
                this.apiLoaded = true;
            };
            document.head.appendChild(script);
        }
    }

    ngOnChanges(changes: SimpleChanges): void {
        if ((changes['latitude'] || changes['longitude']) && this.latitude && this.longitude) {
            this.center = { lat: this.latitude(), lng: this.longitude() };
            this.markerPosition = { lat: this.latitude(), lng: this.longitude() };
        }
    }

    onMapClick(event: google.maps.MapMouseEvent) {
        if (event.latLng) {
            this.markerPosition = {
                lat: event.latLng.lat(),
                lng: event.latLng.lng()
            };

            this.dataOut.emit(this.markerPosition);
        }
    }
}
