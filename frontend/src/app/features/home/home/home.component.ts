import { Component } from '@angular/core';
import { HeroSectionComponent } from '../components/hero-section/hero-section.component';
import { CategoriesSectionComponent } from '../components/categories-section/categories-section.component';
import { NewArrivalsSectionComponent } from '../components/new-arrivals-section/new-arrivals-section.component';
import { TopSalesSectionComponent } from '../components/top-sales-section/top-sales-section.component';
import { AboutSectionComponent } from '../components/about-section/about-section.component';
import { TestimonialsSectionComponent } from '../components/testimonials-section/testimonials-section.component';
import { CtaSectionComponent } from '../components/cta-section/cta-section.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    HeroSectionComponent,
    CategoriesSectionComponent,
    NewArrivalsSectionComponent,
    TopSalesSectionComponent,
    AboutSectionComponent,
    TestimonialsSectionComponent,
    CtaSectionComponent
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
}
