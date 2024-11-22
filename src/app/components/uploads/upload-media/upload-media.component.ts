import { Component, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { SharedService } from '../../../services/shared.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-upload-media',
  templateUrl: './upload-media.component.html',
  styleUrl: './upload-media.component.css'
})
export class UploadMediaComponent {
  form: FormGroup
  paramId: any
  data: any;
  tagData: any;
  uploadImg: any;
  uploadedImage: any;

  constructor(
    private fb: FormBuilder,
    private toastr: ToastrService,
    private service: SharedService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.form = this.fb.group({
      name: [''],
      category: [''],
      tags: [''],
    })

    this.route.queryParams.subscribe((params) => {
      this.paramId = params['id']
    });
  }

  ngOnInit() {
    this.getCategories()
    this.getTags()
    if (this.paramId) {
      this.getById()
    }
  }

  ngFileInputChange(e: any) {
    this.uploadImg = e.target.files[0]
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = (e: any) => {
      this.uploadedImage = e.target.result;
    };
    reader.readAsDataURL(file);
  }

  onSubmit(form: any) {
    form.markAllAsTouched()
    if (form.invalid) {
      return
    }

    const tags: any = this.selectedItems.map(item => item.id)

    const categories: any = this.selectedCatItems.map(item => ({
      "category_id": item.categoryId,
      "subcategory_id": item.subcategoryId
    }));

    let apiUrl = ''
    let formData = new FormData()
    if (this.paramId) {
      apiUrl = `image/updateimage-byid`
      formData.append('category', JSON.stringify(categories))
      formData.append('file', this.uploadImg)
      formData.append('id', this.paramId)
      formData.append('tag_id', tags)
    } else {
      apiUrl = `image/create`
      formData.append('category', JSON.stringify(categories))
      formData.append('file', this.uploadImg)
      formData.append('tag_id', tags)
      formData.append('collaburate_status', '2')
    }

    this.service.upload(apiUrl, formData).subscribe(res => {
      if (res.success) {
        this.toastr.success(res.message)
        this.router.navigate(['/all-images'])
      } else {
        this.toastr.error(res.message)
      }
    })
  }

  getErrorMessage(field: string) {
    const control = this.form.controls[field]
    if (control.hasError('required')) {
      return 'This field cannot be empty'
    }
    return ''
  }

  getById() {
    let apiurl = `image/image-profile?id=${this.paramId}`
    this.service.get(apiurl).subscribe(res => {
      if (res.success) {
        const data = res.imageData.findImageProfile[0]
        data.sub_album.forEach((album: any) => {
          this.filteredCatOptions.forEach(category => {
            if (category.id == album.category_id) {
              category.subcategoryData.forEach((subcategory: any) => {
                if (subcategory.id == album.subcategory_id) {
                  subcategory.selected = true;
                  category.selected = true
                  const existingItem = this.selectedCatItems.find(item =>
                    item.categoryId == category.id && item.subcategoryId == subcategory.id
                  );

                  if (!existingItem) {
                    this.selectedCatItems.push({
                      categoryId: category.id,
                      subcategoryId: subcategory.id,
                      categoryName: category.category_name,
                      subcategoryName: subcategory.subcategory_name,
                      selected: true
                    });
                  }
                }
              });
            }
          });
        });

        this.selectedItems = [...data.tags]
        this.uploadedImage = data.image;
      } else {
        this.toastr.error(res.message)
      }
    })
  }

  getCategories() {
    let apiUrl = `image/get-categoryandsubcategory`
    this.service.get(apiUrl).subscribe(res => {
      if (res.success) {
        this.data = res.data
        this.filteredCatOptions = [...this.data]
      } else {
        this.toastr.error(res.message)
      }
    })
  }

  getTags() {
    let apiUrl = `tag/get-all`
    this.service.get(apiUrl).subscribe(res => {
      if (res.success) {
        this.tagData = res.tagAll
        this.filteredOptions = [...this.tagData]
      } else {
        this.toastr.error(res.message)
      }
    })
    console.log(this.filteredOptions);

  }

  options: string[] = ['Option 1', 'Option 2', 'Option 3', 'Gagan'];
  selectedItems: any[] = [];
  filteredOptions: any[] = [];
  filteredCatOptions: any[] = [];
  searchTerm: string = '';
  searchCatTerm: string = '';
  dropdownOpen: boolean = false;
  dropdownOpenCat: boolean = false;
  selectedCatItems: any[] = [];

  toggleDropdown(open: boolean) {
    this.dropdownOpen = open;
  }

  toggleCatDropdown(open: boolean) {
    this.dropdownOpenCat = open;
  }
  closeAll() {
    this.dropdownOpenCat = this.dropdownOpen = false
  }

  filterOptions() {
    if (this.searchTerm) {
      const search = this.searchTerm.toLowerCase();
      this.filteredOptions = this.tagData.filter(
        (item: any) =>
          item.tag.toLowerCase().includes(search) ||
          item.subTagData?.some((sub: any) =>
            sub.sub_tagName.toLowerCase().includes(search)
          )
      );
    } else {
      this.filteredOptions = [...this.tagData];
    }
  }

  filterCatOptions() {
    if (this.searchCatTerm) {
      const searchTerm = this.searchCatTerm.toLowerCase();
      this.filteredCatOptions = this.data.filter((item: any) => {
        const matchesCategory = item.category_name.toLowerCase().includes(searchTerm);
        const matchesSubcategory = item.subcategoryData?.some((sub: any) =>
          sub.subcategory_name.toLowerCase().includes(searchTerm)
        );
        const matchesSubSubcategory = item.subcategoryData?.some((sub: any) =>
          sub.sub_sub_category_data?.some((subSub: any) =>
            subSub.sub_sub_categoryName.toLowerCase().includes(searchTerm)
          )
        );
        return matchesCategory || matchesSubcategory || matchesSubSubcategory;
      });
    } else {
      this.filteredCatOptions = [...this.data];
    }
  }

  onTagChange(tag: any, event: any) {
    tag.selected = event.target.checked;
    if (tag.selected) {
      const existingTag = this.selectedItems.find((item) => item.id === tag.id);
      if (!existingTag) {
        this.selectedItems.push({ id: tag.id, tag: tag.tag, subTagName: null });
      }
    } else {
      this.selectedItems = this.selectedItems.filter((item) => item.id !== tag.id);
      tag.subTagData?.forEach((subTag: any) => {
        subTag.selected = false;
      });
    }
  }

  onSubTagChange(tag: any, subTag: any, event: any) {
    subTag.selected = event.target.checked;

    // Find if the tag is already in selectedItems
    let existingTag = this.selectedItems.find(item => item.tag_id === tag.id);

    if (subTag.selected) {
      // If the tag is not in selectedItems, add it
      if (!existingTag) {
        this.selectedItems.push({
          tag_id: tag.id,
          tag_name: tag.tag,
          subtag_id: [subTag.id],
          subtag_name: [subTag.sub_tagName]
        });
      } else {
        // If the tag is already in selectedItems, add the subTag ID and name to the subtag arrays
        if (!existingTag.subtag_id.includes(subTag.id)) {
          existingTag.subtag_id.push(subTag.id);
          existingTag.subtag_name.push(subTag.sub_tagName);
        }
      }
    } else {
      // If the subTag is deselected, remove the subTag ID and name from the arrays
      if (existingTag) {
        const subTagIndex = existingTag.subtag_id.indexOf(subTag.id);
        if (subTagIndex !== -1) {
          existingTag.subtag_id.splice(subTagIndex, 1);
          existingTag.subtag_name.splice(subTagIndex, 1);
        }

        // If no subTags remain selected for this tag, remove the tag from selectedItems
        if (existingTag.subtag_id.length === 0) {
          this.selectedItems = this.selectedItems.filter(item => item.tag_id !== tag.id);
        }
      }
    }
    tag.selected = tag.subTagData.some((sub: any) => sub.selected);

    console.log('Updated selectedItems:', this.selectedItems);
  }



  removeItem(item: any) {
    this.selectedItems = this.selectedItems.filter((selected) => selected !== item);
    const tag = this.data.find((t: any) => t.id === item.id);
    if (tag) {
      tag.selected = false;
      if (item.subTagName) {
        const subTag = tag.subTagData?.find((sub: any) => sub.sub_tagName === item.subTagName);
        if (subTag) {
          subTag.selected = false;
          subTag.disabled = false;
        }
      } else {
        tag.subTagData?.forEach((sub: any) => {
          sub.selected = false;
          sub.disabled = false;
        });
      }
    }
    console.log(this.selectedItems);

  }


  onCategoryChange(category: any, event: any): void {
    category.selected = event.target.checked;
    if (category.selected) {
      this.selectedCatItems.push(
        {
          categoryId: category.id,
          subcategoryId: null,
          categoryName: category.category_name,
          subcategoryName: null,
        },
      );

      category.subcategoryData?.forEach((sub: any) => {
        sub.selected = false;
        sub.disabled = false;

        sub.sub_sub_category_data?.forEach((subSub: any) => {
          subSub.selected = false;
          subSub.disabled = false;
        });
      });
    } else {
      this.selectedCatItems = this.selectedCatItems.filter(
        (item) => item.categoryId !== category.id
      );

      category.subcategoryData?.forEach((sub: any) => {
        sub.selected = false;
        sub.disabled = false;

        sub.sub_sub_category_data?.forEach((subSub: any) => {
          subSub.selected = false;
          subSub.disabled = false;
        });
      });
    }
  }

  onSubcategoryChange(category: any, subcategory: any, event: any): void {
    subcategory.selected = event.target.checked;

    if (subcategory.selected) {
      category.selected = true;

      this.selectedCatItems.push(
        {
          categoryId: category.id,
          subcategoryId: subcategory.id,
          categoryName: category.category_name,
          subcategoryName: subcategory.subcategory_name,
        },
      );

      category.subcategoryData?.forEach((sub: any) => {
        sub.disabled = sub !== subcategory;

        sub.sub_sub_category_data?.forEach((subSub: any) => {
          subSub.selected = false;
          subSub.disabled = sub !== subcategory;
        });
      });
    } else {
      this.selectedCatItems = this.selectedCatItems.filter(
        (item) => item.subcategoryId !== subcategory.id
      );

      const anySelected = category.subcategoryData?.some((sub: any) => sub.selected);
      if (!anySelected) {
        category.selected = false;
      }

      category.subcategoryData?.forEach((sub: any) => {
        sub.disabled = false;
      });
    }
  }

  onSubSubcategoryChange(
    category: any,
    subcategory: any,
    subsubcategory: any,
    event: any
  ): void {
    subsubcategory.selected = event.target.checked;

    if (subsubcategory.selected) {
      category.selected = true;
      subcategory.selected = true;

      this.selectedCatItems.push(
        {
          categoryId: category.id,
          subcategoryId: subcategory.id,
          subSubcategoryId: subsubcategory.id,
          categoryName: category.category_name,
          subcategoryName: subcategory.subcategory_name,
          subSubCategoryName: subsubcategory.sub_sub_categoryName,
        },
      );

      category.subcategoryData?.forEach((sub: any) => {
        sub.disabled = sub !== subcategory;

        sub.sub_sub_category_data?.forEach((subSub: any) => {
          subSub.disabled = sub !== subcategory || subSub !== subsubcategory;
        });
      });
    } else {
      this.selectedCatItems = this.selectedCatItems.filter(
        (item) => item.subSubCategoryName !== subsubcategory.sub_sub_categoryName
      );

      const anySelected = subcategory.sub_sub_category_data?.some(
        (subSub: any) => subSub.selected
      );
      if (!anySelected) {
        subcategory.selected = false;
      }

      const subcategoriesSelected = category.subcategoryData?.some(
        (sub: any) => sub.selected
      );
      if (!subcategoriesSelected) {
        category.selected = false;
      }

      subcategory.sub_sub_category_data?.forEach((subSub: any) => {
        subSub.disabled = false;
      });

      category.subcategoryData?.forEach((sub: any) => {
        sub.disabled = false;
      });
    }
    console.log(this.selectedCatItems);
  }

}
