import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomePage } from './home.page';
import { TaskService } from '../services/data/task.service';
import { CategoryService } from '../services/data/category.service';

describe('HomePage', () => {
  let component: HomePage;
  let fixture: ComponentFixture<HomePage>;
  let taskService: any;
  let categoryService: any;

  beforeEach(async () => {
    fixture = TestBed.createComponent(HomePage);
    component = fixture.componentInstance;
    taskService = TestBed.inject(TaskService);
    categoryService = TestBed.inject(CategoryService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('pagination', () => {
    beforeEach(() => {
      // fill task service with 25 items to exercise paging
      const tasks = Array.from({ length: 25 }, (_, i) => ({
        id: `${i}`,
        title: `t${i}`,
        completed: false,
        categoryId: ''
      }));
      taskService.setTasks(tasks);
    });

    it('calculates pages correctly', () => {
      expect(component.totalPages()).toBe(Math.ceil(25 / component.pageSize));
      // first page should contain pageSize items
      expect(component.pagedTasks().length).toBe(component.pageSize);
    });

    it('navigates forward and back', () => {
      const firstSlice = component.pagedTasks();
      component.nextPage();
      expect(component.currentPage()).toBe(1);
      expect(component.pagedTasks()).not.toEqual(firstSlice);
      component.prevPage();
      expect(component.currentPage()).toBe(0);
      expect(component.pagedTasks()).toEqual(firstSlice);
    });

    it('resets page when filter changes', () => {
      component.nextPage();
      expect(component.currentPage()).toBe(1);
      component.selectedCategoryId.set('some');
      fixture.detectChanges(); // trigger effects if they run within Angular zone
      expect(component.currentPage()).toBe(0);
    });
  });

  describe('category pagination', () => {
    beforeEach(() => {
      // add 45 categories
      for (let i = 0; i < 45; i++) {
        categoryService.addCategory('c' + i);
      }
    });

    it('paginates categories', () => {
      expect(component.totalCategoryPages()).toBe(Math.ceil(45 / component.catPageSize));
      expect(component.pagedCategories().length).toBe(component.catPageSize);
    });

    it('can navigate category pages', () => {
      const first = component.pagedCategories();
      component.nextCatPage();
      expect(component.catCurrentPage()).toBe(1);
      expect(component.pagedCategories()).not.toEqual(first);
    });

    it('resets category page on list change', () => {
      component.nextCatPage();
      expect(component.catCurrentPage()).toBe(1);
      // simulate addition
      categoryService.addCategory('n');
      fixture.detectChanges();
      expect(component.catCurrentPage()).toBe(0);
    });
  });
});
