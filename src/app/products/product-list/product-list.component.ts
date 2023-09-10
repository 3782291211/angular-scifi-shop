import { BreakpointObserver } from '@angular/cdk/layout';
import { Component, OnInit } from '@angular/core';
import { MatButtonToggleChange } from '@angular/material/button-toggle';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { combineLatest, map, Observable, Subscription } from 'rxjs';
import { 
  selectActiveId as selectActiveCartId, 
  selectUpdateStatus as selectCartUpdateStatus
} from 'src/app/ngrx/cart/cart.feature';
import { 
  selectActiveId as selectActiveWishlistId, 
  selectUpdateStatus as selectWishlistUpdateStatus
} from 'src/app/ngrx/wishlist/wishlist.feature';
import { selectCategories, selectSuppliers } from 'src/app/ngrx/categories/categories.feature';
import { selectLoadStatus, selectProducts } from 'src/app/ngrx/products/products.feature';
import { resetWishlistStatus, updateActiveId, updateWishlist } from 'src/app/ngrx/wishlist/wishlist.actions';
import { selectWishlist } from 'src/app/ngrx/wishlist/wishlist.feature';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.sass']
})
export class ProductListComponent implements OnInit {
  wishlist$: Observable<Wishlist | null> = this._store.select(selectWishlist);
  products$: Observable<Product[] | null> = this._store.select(selectProducts);
  categories$: Observable<Category[] | null> = this._store.select(selectCategories);
  suppliers$: Observable<Supplier[] | null> = this._store.select(selectSuppliers);
  productLoadStatus$: Observable<Status> = this._store.select(selectLoadStatus);
  cartUpdateStatus$: Observable<Status> = this._store.select(selectCartUpdateStatus);
  wishlistUpdateStatus$: Observable<Status> = this._store.select(selectWishlistUpdateStatus)
  cartActiveId$: Observable<number> = this._store.select(selectActiveCartId);
  wishlistActiveId$: Observable<number> = this._store.select(selectActiveWishlistId);
  private _breakpointSubscription = Subscription.EMPTY;
  private _streamSubscription = Subscription.EMPTY;
  listDisplayStyle = "grid";
  showDisplayToggle = true;
  private _wishlistOperation: "add" | "remove" | undefined;
  category: Category | null | undefined = null;
  supplier: Supplier | null | undefined = null;
  datastream$ = combineLatest([
    this.categories$, this.suppliers$, this._route.queryParamMap, this.wishlistUpdateStatus$
  ]).pipe(map(([categories, suppliers, queryParamMap, wishlistUpdateStatus]) => ({
    categories, suppliers, queryParamMap, wishlistUpdateStatus
  })));

  constructor(
    private _store: Store<AppState>,
    private _route: ActivatedRoute,
    private _breakPointObserver: BreakpointObserver,
    private _snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this._breakpointSubscription = this._breakPointObserver
      .observe('(max-width: 880px)')
      .subscribe(({ matches }) => {
        if (matches) {
          this.listDisplayStyle = "grid";
          this.showDisplayToggle = false;
        } else {
          this.showDisplayToggle = true;
        }
      });

    this._streamSubscription = this.datastream$
      .subscribe(({ categories, suppliers, queryParamMap, wishlistUpdateStatus }) => {
        const categoryParam = queryParamMap.get("category");
        const supplierParam = queryParamMap.get("supplier");
        if (categoryParam && categories) {
          this.category = categories.find(category => category.name === categoryParam);
        } else if (!categoryParam) {
          this.category = null;
        }

        if (supplierParam && suppliers) {
          this.supplier = suppliers.find(supplier => supplier.name === supplierParam);
        } else if (!supplierParam) {
          this.supplier = null;
        }

        if (wishlistUpdateStatus === "success") {
          const message = this._wishlistOperation === "add" ? "Product successfully added to wishlist." : "Product successfully removed from wishlist.";
          this._snackBar.open(message, "Dismiss", {
            horizontalPosition: "start",
            verticalPosition: "top",
            duration: 8000
          });
        }
      });
  }

  ngOnDestroy() {
    this._breakpointSubscription.unsubscribe();
    this._streamSubscription.unsubscribe();
    this._store.dispatch(resetWishlistStatus());
  }

  get headerImageSrc() {
    return this.category ? 
      `assets/categories/${this.category.thumbnail}.svg` 
      : this.supplier ? 
      `assets/suppliers/${this.supplier.thumbnail}.svg` 
      : "assets/products.svg";
  }

  get productListClass() {
    return {
      "product-list": this.listDisplayStyle === 'list',
      "product-grid": this.listDisplayStyle === 'grid'
    };
  }

  productIsInWishlist(productId: number, wishlist: Wishlist) {
    return wishlist.wishlistItems.find(item => item.product.id === productId);
  }

  updateWishlist(productId: number, wishlist: Wishlist, operation: "add" | "remove") {
    this._wishlistOperation = operation;
    this._store.dispatch(updateActiveId({ activeId: productId }));
    let wishlistArray: WishlistItem[] | [] = [];
    const transformWishlistArray = (item: { product: Product }) => ({ 
      customerId: wishlist.id,
      productId: item.product.id
    });

    if (operation === "add") {
      wishlistArray = wishlist.wishlistItems.map(transformWishlistArray);
      wishlistArray.unshift({ customerId: wishlist.id, productId });
    } else {
      wishlistArray = wishlist.wishlistItems
      .filter(item => item.product.id !== productId)
      .map(transformWishlistArray);
    }
      
    this._store.dispatch(updateWishlist({
      updatedWishlist: wishlistArray,
      customerId: wishlist.id
    }));
  }

  toggleStyle(e: MatButtonToggleChange) {
    this.listDisplayStyle = e.value;
  }
}