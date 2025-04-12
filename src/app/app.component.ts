import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { RouterOutlet } from '@angular/router';
import { CommonModule, NgFor } from '@angular/common';

@Component({
  selector: 'app-root',
  imports: [FormsModule, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'trip';
  tripList: { startPoint: string; endPoint: string }[] = [];
  visualTrips: { tripName: string; type: string; level: boolean }[] = [];
  sliceTripName(startPoint: string, endPoint: string) {
    return startPoint.slice(0, 3) + '-' + endPoint.slice(0, 3);
  }
  submitForm(form: NgForm) {
    this.tripList.push(form.value);
    if (this.tripList.length === 1) {
      const tripName = this.sliceTripName(
        this.tripList[0].startPoint,
        this.tripList[0].endPoint
      );
      this.visualTrips[0] = {
        tripName: tripName,
        type: 'no-line',
        level: false,
      };
    } else {
      for (let i = 0; i < this.tripList.length; i++) {
        const currentTrip = this.tripList[i];
        const nextTrip = this.tripList[i + 1];
        const prevTrip = this.tripList[i - 1];
        const currentTripName = this.sliceTripName(
          currentTrip.startPoint,
          currentTrip.endPoint
        );
        const level = false;

        if (
          nextTrip &&
          currentTrip.endPoint === nextTrip.endPoint &&
          currentTrip.startPoint === nextTrip.startPoint
        ) {
          const nextTripName = this.sliceTripName(
            nextTrip.startPoint,
            nextTrip.endPoint
          );
          this.visualTrips[i] = {
            tripName: currentTripName,
            type:
              currentTrip.endPoint === nextTrip.startPoint
                ? 'line'
                : 'arrow-line',
            level: true,
          };
          this.visualTrips[i + 1] = {
            tripName: nextTripName,
            type: 'slant-line-right',
            level: true,
          };
          if (prevTrip) {
            const prevTrip = this.tripList[i - 1];
            const prevTripName = this.sliceTripName(
              prevTrip.startPoint,
              prevTrip.endPoint
            );
            this.visualTrips[i - 1] = {
              tripName: prevTripName,
              type:
                currentTrip.endPoint === prevTrip.endPoint &&
                currentTrip.startPoint === prevTrip.startPoint
                  ? currentTrip.startPoint === prevTrip.endPoint
                    ? 'line'
                    : 'arrow-line'
                  : currentTrip.endPoint === nextTrip.endPoint &&
                    currentTrip.startPoint === currentTrip.startPoint &&
                    !(
                      currentTrip.endPoint === prevTrip.endPoint &&
                      currentTrip.startPoint === prevTrip.startPoint
                    ) &&
                    this.visualTrips[i - 1] &&
                    this.visualTrips[i - 1].level === false
                  ? 'slant-line-left'
                  : 'line',
              level: this.visualTrips[i - 1].level
                ? this.visualTrips[i - 1].level
                : false,
            };
          }
        } else if (nextTrip && currentTrip.endPoint === nextTrip.startPoint) {
          this.visualTrips[i] = {
            tripName: currentTripName,
            type: 'line',
            level: this.visualTrips[i] ? this.visualTrips[i].level : level,
          };
        } else {
          this.visualTrips[i] = {
            tripName: currentTripName,
            type:
              this.visualTrips[i] &&
              this.visualTrips[i].type !== 'no-line' &&
              prevTrip &&
              prevTrip.endPoint === currentTrip.endPoint &&
              prevTrip.startPoint === currentTrip.startPoint
                ? this.visualTrips[i].type
                : 'arrow-line',
            level: this.visualTrips[i] ? this.visualTrips[i].level : level,
          };
        }
      }
    }
    this.visualTrips[this.visualTrips.length - 1].type = 'no-line';
    console.log(this.visualTrips);
  }
}
