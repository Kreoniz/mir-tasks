import {
  Directive,
  Input,
  ElementRef,
  Renderer2,
  ViewContainerRef,
  TemplateRef,
  OnDestroy,
  EmbeddedViewRef,
  HostListener,
  OnInit,
  inject,
} from '@angular/core';

@Directive({
  selector: '[appMirTooltip]',
  standalone: true,
})
export class MirTooltipDirective implements OnDestroy, OnInit {
  @Input('appMirTooltip') content: string | TemplateRef<any> | null = null;
  @Input() tooltipPosition: 'auto' | 'top' | 'bottom' | 'left' | 'right' =
    'auto';

  private tooltipElement: HTMLElement | null = null;
  private tooltipArrow: HTMLElement | null = null;
  private viewRef: EmbeddedViewRef<any> | null = null;
  private positionTimeout: any;
  private windowListeners: (() => void)[] = [];
  private elementRef = inject(ElementRef);
  private renderer = inject(Renderer2);
  private viewContainerRef = inject(ViewContainerRef);

  ngOnInit() {
    this.renderer.setStyle(this.elementRef.nativeElement, 'cursor', 'pointer');
  }

  @HostListener('mouseenter')
  showTooltip() {
    if (!this.content || this.tooltipElement) return;

    this.positionTimeout = setTimeout(() => {
      this.createTooltip();
      this.positionTooltip();

      setTimeout(() => {
        if (this.tooltipElement) {
          this.renderer.addClass(this.tooltipElement, 'show');
        }
      }, 10);
    }, 30);
  }

  @HostListener('mouseleave')
  hideTooltip() {
    clearTimeout(this.positionTimeout);
    this.renderer.removeClass(this.tooltipElement, 'show');
    setTimeout(() => {
      this.destroyTooltip();
    }, 10);
    this.destroyTooltip();
  }

  private createTooltip() {
    this.tooltipElement = this.renderer.createElement('div');
    this.renderer.addClass(this.tooltipElement, 'custom-tooltip');

    this.tooltipArrow = this.renderer.createElement('div');
    this.renderer.addClass(this.tooltipArrow, 'tooltip-arrow');
    this.renderer.appendChild(this.tooltipElement, this.tooltipArrow);

    const contentContainer = this.renderer.createElement('div');
    this.renderer.addClass(contentContainer, 'tooltip-content');

    if (typeof this.content === 'string') {
      this.renderer.setProperty(contentContainer, 'innerHTML', this.content);
    } else {
      this.viewRef = this.viewContainerRef.createEmbeddedView(this.content!);
      this.viewRef.rootNodes.forEach((node) => {
        this.renderer.appendChild(contentContainer, node);
      });
    }

    this.renderer.appendChild(this.tooltipElement, contentContainer);
    this.renderer.appendChild(document.body, this.tooltipElement);

    this.windowListeners.push(
      this.renderer.listen('window', 'scroll', () => this.positionTooltip()),
    );
    this.windowListeners.push(
      this.renderer.listen('window', 'resize', () => this.positionTooltip()),
    );
  }

  private positionTooltip() {
    if (!this.tooltipElement || !this.tooltipArrow) return;

    const hostRect = this.elementRef.nativeElement.getBoundingClientRect();
    const tooltipRect = this.tooltipElement.getBoundingClientRect();

    const positions = this.calculatePossiblePositions(
      hostRect,
      tooltipRect,
      scrollY,
    );
    const bestPosition = this.selectBestPosition(positions, tooltipRect);

    this.applyPosition(bestPosition);
  }

  private calculatePossiblePositions(
    hostRect: DOMRect,
    tooltipRect: DOMRect,
    scrollY: number,
  ) {
    const positions: any = {};
    const spacing = 10;

    positions.top = {
      top: hostRect.top + scrollY - tooltipRect.height - spacing,
      left: hostRect.left + hostRect.width / 2 - tooltipRect.width / 2,
      arrowClass: 'bottom',
      arrowPosition: { left: '50%', top: '50%' },
    };

    positions.bottom = {
      top: hostRect.bottom + scrollY + spacing,
      left: hostRect.left + hostRect.width / 2 - tooltipRect.width / 2,
      arrowClass: 'top',
      arrowPosition: { left: '50%', top: '0%' },
    };

    positions.left = {
      top:
        hostRect.top + scrollY + hostRect.height / 2 - tooltipRect.height / 2,
      left: hostRect.left + scrollX - tooltipRect.width - spacing,
      arrowClass: 'right',
      arrowPosition: { left: 'calc(100% - 1.5rem)', top: '50%' },
    };

    positions.right = {
      top:
        hostRect.top + scrollY + hostRect.height / 2 - tooltipRect.height / 2,
      left: hostRect.right + scrollX + spacing,
      arrowClass: 'left',
      arrowPosition: { left: '0%', top: '50%' },
    };

    return positions;
  }

  private selectBestPosition(positions: any, tooltipRect: DOMRect) {
    const windowHeight = window.innerHeight;
    const windowWidth = window.innerWidth;

    if (this.tooltipPosition !== 'auto') {
      return positions[this.tooltipPosition];
    }

    const positionOrder = ['bottom', 'top', 'right', 'left'];

    for (const pos of positionOrder) {
      const position = positions[pos];
      const isTopBottom = pos === 'top' || pos === 'bottom';
      const isLeftRight = pos === 'left' || pos === 'right';

      const fitsVertically =
        position.top >= 0 && position.top + tooltipRect.height <= windowHeight;
      const fitsHorizontally =
        position.left >= 0 && position.left + tooltipRect.width <= windowWidth;

      if (
        (isTopBottom && fitsHorizontally) ||
        (isLeftRight && fitsVertically)
      ) {
        return position;
      }
    }

    return positions.bottom;
  }

  private applyPosition(position: any) {
    if (!this.tooltipElement || !this.tooltipArrow) return;

    this.renderer.setStyle(this.tooltipElement, 'top', `${position.top}px`);
    this.renderer.setStyle(this.tooltipElement, 'left', `${position.left}px`);

    ['top', 'bottom', 'left', 'right'].forEach((dir) => {
      this.renderer.removeClass(this.tooltipArrow, `arrow-${dir}`);
    });
    this.renderer.addClass(this.tooltipArrow, `arrow-${position.arrowClass}`);

    Object.keys(position.arrowPosition).forEach((key) => {
      this.renderer.setStyle(
        this.tooltipArrow,
        key,
        position.arrowPosition[key],
      );
    });
  }

  private destroyTooltip() {
    if (this.tooltipElement) {
      this.renderer.removeChild(document.body, this.tooltipElement);
      this.tooltipElement = null;
    }
    if (this.viewRef) {
      this.viewRef.destroy();
      this.viewRef = null;
    }
    this.tooltipArrow = null;

    this.windowListeners.forEach((remove) => remove());
    this.windowListeners = [];
  }

  ngOnDestroy() {
    this.destroyTooltip();
    clearTimeout(this.positionTimeout);
  }
}
