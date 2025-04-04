import { Injectable, Renderer2, RendererFactory2 } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private darkMode = new BehaviorSubject<boolean>(false);
  private renderer: Renderer2;

  constructor(rendererFactory: RendererFactory2) {
    this.renderer = rendererFactory.createRenderer(null, null);
    this.initTheme();
  }

  private initTheme(): void {
    // Check for saved preference or system preference
    const savedTheme = localStorage.getItem('theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    let currentIsDark = false;
    
    if (savedTheme === 'dark') {
      currentIsDark = true;
    } else if (savedTheme === 'light') {
      currentIsDark = false;
    } else {
      // Use system preference if no saved preference
      currentIsDark = systemPrefersDark;
    }
    
    this.setTheme(currentIsDark);
  }

  isDarkMode(): Observable<boolean> {
    return this.darkMode.asObservable();
  }

  toggleDarkMode(): void {
    this.setTheme(!this.darkMode.value);
  }

  private setTheme(isDark: boolean): void {
    this.darkMode.next(isDark);
    
    if (isDark) {
      this.renderer.addClass(document.documentElement, 'dark');
      localStorage.setItem('theme', 'dark');
    } else {
      this.renderer.removeClass(document.documentElement, 'dark');
      localStorage.setItem('theme', 'light');
    }
  }
}