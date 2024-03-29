import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-thermometer',
  templateUrl: './thermometer.component.html',
  styleUrls: ['./thermometer.component.css']
})
export class ThermometerComponent implements OnInit {
  //TODO: define Input fields and bind them to the template.
  @Input() audioFeature:string;
	@Input() percentStr:string;
  @Input() color:string;
  style:string;
  constructor() { }

  ngOnInit() {
    // this constructs the string used to set the style for the thermometer
    // meaning it sets the color and width of the progress bar based on what
    // the audio feature specifies
    this.style="background-color:"+this.color+"; width:"+this.percentStr;
  }

}
