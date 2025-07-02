import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MirTooltipDirective } from './ui/mir-tooltip/mir-tooltip.directive';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, MirTooltipDirective],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'mir-tasks';
}
