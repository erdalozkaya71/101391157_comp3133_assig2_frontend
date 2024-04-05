import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import axios from 'axios';
import { NgFor, NgIf } from '@angular/common';

@Component({
  selector: 'app-employee-details',
  templateUrl: './employee-details.component.html',
  styleUrls: ['./employee-details.component.css'],
  standalone: true,
  imports: [NgFor, NgIf], // Assuming you might need NgIf for conditional rendering in your template
})
export class EmployeeDetailsComponent implements OnInit {
  employee: any;

  constructor(private route: ActivatedRoute, private router: Router) {}

  ngOnInit() {
    this.route.params.subscribe((params) => {
      this.loadEmployeeDetails(params['id']);
    });
  }

  loadEmployeeDetails(id: string) {
    const query = `
      query SearchEmployeeById($searchEmployeeByIdId: ID!) {
        searchEmployeeById(id: $searchEmployeeByIdId) {
          id
          first_name
          last_name
          email
          gender
          salary
        }
      }
    `;

    axios
      .post(`https://101391157-comp3133-assig2-backend.vercel.app/`, {
        query: query,
        variables: { searchEmployeeByIdId: id },
      })
      .then((response) => {
        this.employee = response.data.data.searchEmployeeById;
      })
      .catch((error) => {
        console.error('Error fetching employee details:', error);
      });
  }
  navigateBack() {
    this.router.navigate(['/employee-list']);
  }
}
