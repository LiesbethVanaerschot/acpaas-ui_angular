import { Directive, ElementRef, OnDestroy, Host, HostListener, HostBinding, Inject, PLATFORM_ID, OnInit } from '@angular/core';
import { isPlatformBrowser, DOCUMENT } from '@angular/common';
import { Subject } from 'rxjs';
import { first, takeUntil } from 'rxjs/operators';

import { FlyoutDirective } from './flyout.directive';
import { FlyoutState } from '../types/flyout.types';

// @dynamic
@Directive({
	selector: '[auiFlyoutAction]',
	exportAs: 'auiFlyoutAction',
})
export class FlyoutActionDirective implements OnInit, OnDestroy {
	@HostBinding('class.aui-flyout-action') class = true;
	@HostBinding('attr.tabindex') tabindex = '0';

	private isPlatformBrowser: boolean;
	private destroyed$ = new Subject<boolean>();

	constructor(
		@Host() public flyout: FlyoutDirective,
		@Inject(PLATFORM_ID) platformId: Object,
		@Inject(DOCUMENT) private document: Document,
		private elementRef: ElementRef
	) {
		this.isPlatformBrowser = isPlatformBrowser(platformId);
		this.closeIfInClosableZone = this.closeIfInClosableZone.bind(this);
		this.onBlur = this.onBlur.bind(this);
	}

	public ngOnInit(): void {
		this.flyout.state$
			.pipe(
				takeUntil(this.destroyed$)
			)
			.subscribe((state: FlyoutState) => {
				if (state === FlyoutState.OPEN) {
					setTimeout(() => {
						this.addEventListeners();
					}, 300); // flyout open delay
				} else {
					this.removeEventListeners();
				}
			});
	}

	public ngOnDestroy(): void {
		this.destroyed$.next(true);
		this.destroyed$.complete();

		if (this.isPlatformBrowser) {
			this.document.removeEventListener('click', this.closeIfInClosableZone, true);
		}
	}

	@HostListener('click')
	public onClick(): void {
		if (this.flyout.isOpened && this.flyout.toggleClick) {
			this.close();
		} else {
			this.open();
		}
	}

	@HostListener('focus')
	public onFocus(): void {
		if (!this.isPlatformBrowser || this.flyout.isOpened) {
			return;
		}

		this.open();
	}

	public onBlur(event: FocusEvent): void {
		if (!this.isPlatformBrowser || !this.flyout.isOpened) {
			return;
		}

		const isInClosableZone = !event.relatedTarget || this.flyout.isInClosableZone(event.relatedTarget as HTMLElement);
		const isTarget = event.relatedTarget === this.elementRef.nativeElement;

		if (!isInClosableZone && !isTarget) {
			this.close();
		}
	}

	public open(): void {
		if (!this.isPlatformBrowser || this.flyout.isOpened) {
			return;
		}

		this.flyout.open();
	}

	public close(): void {
		if (!this.isPlatformBrowser || !this.flyout.isOpened) {
			return;
		}

		this.flyout.close();
	}

	private addEventListeners(): void {
		this.document.addEventListener('click', this.closeIfInClosableZone, true);
		this.document.addEventListener('focusout', this.onBlur, true);
	}

	private removeEventListeners(): void {
		this.document.removeEventListener('click', this.closeIfInClosableZone, true);
		this.document.removeEventListener('focusout', this.onBlur, true);
	}

	private checkIfInClosableZone(event): Boolean {
		const isInClosableZone = this.flyout.isInClosableZone(event.target as HTMLElement);
		const isTarget = event.target === this.elementRef.nativeElement;
		const containsTarget = this.elementRef.nativeElement.contains(event.target);

		return !isInClosableZone && !isTarget && !containsTarget;
	}

	private closeIfInClosableZone(event: Event): void {
		if (!this.isPlatformBrowser) {
			return;
		}

		const inClosableZone = this.checkIfInClosableZone(event);

		if (inClosableZone) {
			this.close();
		}
	}
}
