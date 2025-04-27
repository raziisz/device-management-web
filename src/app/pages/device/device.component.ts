import { Component } from '@angular/core';
import { DeviceTableComponent } from '../../components/device-table/device-table.component';

@Component({
  selector: 'app-device',
  imports: [DeviceTableComponent],
  templateUrl: './device.component.html',
  styleUrl: './device.component.css',
})
export class DeviceComponent {}
