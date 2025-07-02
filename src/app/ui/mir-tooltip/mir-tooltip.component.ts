/*
import {
  Component,
  Input,
  ElementRef,
  ViewContainerRef,
  TemplateRef,
  ViewChild,
  AfterViewInit,
  OnDestroy,
  ChangeDetectorRef,
} from '@angular/core';

@Component({
  selector: 'mir-tooltip',
  templateUrl: './mir-tooltip.component.html',
  styleUrls: ['./mir-tooltip.component.scss'],
})
export class MirTooltipComponent implements AfterViewInit, OnDestroy {
  @Input() content: string | null = null;
  @Input() contentTemplate: TemplateRef<any> | null = null;
  @Input() viewContainer: ViewContainerRef | null = null;
  @Input() position: 'top' | 'bottom' | 'left' | 'right' = 'top';

  @ViewChild('tooltipElement') tooltipElement!: ElementRef<HTMLElement>;
  @ViewChild('tooltipArrow') tooltipArrow!: ElementRef<HTMLElement>;

  visible = false;
  private hostElement!: HTMLElement;

  constructor(private cdr: ChangeDetectorRef) {}

  get isStringContent(): boolean {
    return typeof this.content === 'string';
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.visible = true;
      this.positionTooltip();
      this.cdr.detectChanges();
    }, 10);
  }

  ngOnDestroy() {
    if (this.tooltipElement?.nativeElement) {
      this.tooltipElement.nativeElement.remove();
    }
  }

  attach(host: HTMLElement) {
    this.hostElement = host;
    document.body.appendChild(this.tooltipElement.nativeElement);
  }

  positionTooltip() {
    if (!this.tooltipElement || !this.hostElement) return;

    const hostRect = this.hostElement.getBoundingClientRect();
    const tooltipRect =
      this.tooltipElement.nativeElement.getBoundingClientRect();
    const scrollY = window.scrollY || document.documentElement.scrollTop;
    const scrollX = window.scrollX || document.documentElement.scrollLeft;

    let top = 0;
    let left = 0;

    switch (this.position) {
      case 'bottom':
        top = hostRect.bottom + scrollY + 10;
        left = hostRect.left + hostRect.width / 2 - tooltipRect.width / 2;
        break;
      case 'left':
        top =
          hostRect.top + scrollY + hostRect.height / 2 - tooltipRect.height / 2;
        left = hostRect.left + scrollX - tooltipRect.width - 10;
        break;
      case 'right':
        top =
          hostRect.top + scrollY + hostRect.height / 2 - tooltipRect.height / 2;
        left = hostRect.right + scrollX + 10;
        break;
      default: // top
        top = hostRect.top + scrollY - tooltipRect.height - 10;
        left = hostRect.left + hostRect.width / 2 - tooltipRect.width / 2;
    }

    this.tooltipElement.nativeElement.style.top = `${top}px`;
    this.tooltipElement.nativeElement.style.left = `${left}px`;
  }
}
*/
