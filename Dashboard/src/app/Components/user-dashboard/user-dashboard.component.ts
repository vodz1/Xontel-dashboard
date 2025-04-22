import { Component } from '@angular/core';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { CommonModule } from '@angular/common';
import { ChartConfiguration, ChartType } from 'chart.js';
import { NgChartsModule } from 'ng2-charts';
import { NavbarComponent } from "../navbar/navbar.component";
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-user-dashboard',
  standalone: true,
  imports: [SidebarComponent, CommonModule, NgChartsModule, NavbarComponent, TranslateModule],
  templateUrl: './user-dashboard.component.html',
  styleUrl: './user-dashboard.component.css'
})
export class UserDashboardComponent {

  barChartData!: ChartConfiguration<'bar'>['data'];
  pieChartData!: ChartConfiguration<'pie'>['data'];
  lineChartData!: ChartConfiguration<'line'>['data'];

  barChartOptions: ChartConfiguration<'bar'>['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        ticks: {
          font: {
            size: 10
          },
          autoSkip: false,
          maxRotation: 90,
          minRotation: 0
        }
      },
      y: {
        beginAtZero: false,
        min: 20,
        ticks: {
          callback: function (value) {
            return value + '%';
          },
        }
      }
    }
  };

  pieChartOptions: ChartConfiguration<'pie'>['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right',
        labels: {
          usePointStyle: true,
          padding: 40,
          boxWidth: 30,
        }
      }
    }
  };

  barChartType: 'bar' = 'bar';
  pieChartType: 'pie' = 'pie';
  lineChartType: 'line' = 'line';

  constructor(private transService: TranslateService) {
    this.loadTranslations();
  }

  loadTranslations() {
    this.transService.stream([
      'charts.sales',
      'charts.optimistic',
      'charts.pessimistic',
      'charts.unsure'
    ]).subscribe(translations => {
      console.log("translatios" , translations);
      

      this.barChartData = {
        labels: ['5k', '10k', '15k', '20k', '25k', '30k', '35k', '40k', '45k', '50k', '55k'],
        datasets: [
          {
            data: [20, 40, 60, 80, 100, 19, 24, 20, 25, 30, 35],
            label: translations['charts.sales'],
            backgroundColor: '#4c84ff',
            barThickness: 8,
            maxBarThickness: 12
          }
        ]
      };

      this.pieChartData = {
        labels: [
          translations['charts.optimistic'],
          translations['charts.pessimistic'],
          translations['charts.unsure']
        ],
        datasets: [{
          data: [60, 25, 15],
          backgroundColor: ['#4c84ff', '#ff6c60', '#ffc107']
        }]
      };

      this.lineChartData = {
        labels: ['2020', '2021', '2022', '2023', '2024'],
        datasets: [
          {
            data: [0, 25, 50, 75, 100],
            label: translations['charts.sales'],
            fill: true,
            tension: 0.4,
            borderColor: '#4c84ff',
            backgroundColor: 'rgba(76,132,255,0.2)'
          }
        ]
      };
    });
  }
}
