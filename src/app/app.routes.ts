import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { ProductsComponent } from './pages/products/products.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { ProductDetailComponent } from './pages/product-detail/product-detail.component';
import { CartComponent } from './pages/cart/cart.component';
import { CheckoutComponent } from './pages/checkout/checkout.component';
import { OrderHistoryComponent } from './pages/order-history/order-history.component';
import { HelpCenterComponent } from './pages/help-center/help-center.component';
import { PrivacyPolicyComponent } from './pages/privacy-policy/privacy-policy.component';
import { ShippingInfoComponent } from './pages/shipping-info/shipping-info.component';
import { ReturnsComponent } from './pages/returns/returns.component';
import { ContactComponent } from './pages/contact/contact.component';
import { AboutComponent } from './pages/about/about.component';
import { AdminLayoutComponent } from './layouts/admin-layout/admin-layout.component';
import { AdminDashboardComponent } from './pages/admin/admin-dashboard/admin-dashboard.component';
import { AdminProductsComponent } from './pages/admin/admin-products/admin-products.component';
import { AdminProductEditComponent } from './pages/admin/admin-product-edit/admin-product-edit.component';
import { AdminCategoriesComponent } from './pages/admin/admin-categories/admin-categories.component';
import { AdminBrandsComponent } from './pages/admin/admin-brands/admin-brands.component';
import { AdminBannersComponent } from './pages/admin/admin-banners/admin-banners.component';
import { AdminGuard } from './guards/admin.guard';
import { LayoutComponent } from './layouts/layout.component';
import { AdminUsersComponent } from './pages/admin/admin-users/admin-users.component';
import { AdminOrdersComponent } from './pages/admin/admin-orders/admin-orders.component';
import { RegisterSellerRequestComponent } from './pages/register-seller-request/register-seller-request.component';
import { AdminRolesComponent } from './pages/admin/admin-roles/admin-roles.component';
import { UserInfoComponent } from './pages/user-info/user-info.component';
import { EditProfileComponent } from './pages/edit-profile/edit-profile.component';
import { ResetPasswordComponent } from './pages/reset-password/reset-password.component';
import { OrderDetailComponent } from './pages/order-detail/order-detail.component';
import { AdminArticleManagerComponent } from './pages/admin/admin-article-manager/admin-article-manager.component';
import { AdminArticleCategoryComponent } from './pages/admin/admin-article-category/admin-article-category.component';
import { AdminArticleAuthorComponent } from './pages/admin/admin-article-author/admin-article-author.component';
import { ArticleDetailComponent } from './pages/article-detail/article-detail.component';
import { AdminSellersComponent } from './pages/admin/admin-sellers/admin-sellers.component';
import { MyShopInfoComponent } from './pages/my-shop-info/my-shop-info.component';

export const routes: Routes = [
  {
    path: '', component: LayoutComponent,
    children: [
      { path: '', component: HomeComponent },
      { path: 'products', component: ProductsComponent },
      { path: 'product/:id', component: ProductDetailComponent },
      { path: 'cart', component: CartComponent },
      { path: 'checkout', component: CheckoutComponent },
      { path: 'order-history', component: OrderHistoryComponent },
      { path: 'login', component: LoginComponent },
      { path: 'register', component: RegisterComponent },
      { path: 'register-seller', component: RegisterSellerRequestComponent },
      { path: 'help-center', component: HelpCenterComponent },
      { path: 'privacy-policy', component: PrivacyPolicyComponent },
      { path: 'shipping-info', component: ShippingInfoComponent },
      { path: 'returns', component: ReturnsComponent },
      { path: 'contact', component: ContactComponent },
      { path: 'about', component: AboutComponent },
      { path: 'user-info', component: UserInfoComponent },
      { path: 'edit-profile', component: EditProfileComponent },
      { path: 'reset-password', component: ResetPasswordComponent },
      { path: 'order/:id', component: OrderDetailComponent },
      { path: 'article/:id', component: ArticleDetailComponent },
      { path: 'my-shop', component: MyShopInfoComponent },
    ]
  },
  {
    path: 'admin',
    component: AdminLayoutComponent,
    canActivate: [AdminGuard],
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: AdminDashboardComponent },
      { path: 'products', component: AdminProductsComponent },
      { path: 'products/new', component: AdminProductEditComponent },
      { path: 'products/edit/:id', component: AdminProductEditComponent },
      { path: 'categories', component: AdminCategoriesComponent },
      { path: 'brands', component: AdminBrandsComponent },
      { path: 'banners', component: AdminBannersComponent },
      { path: 'orders', component: AdminOrdersComponent },
      { path: 'orders/:id', component: AdminOrdersComponent },
      { path: 'users', component: AdminUsersComponent },
      { path: 'sellers', component: AdminSellersComponent },
      { path: 'roles', component: AdminRolesComponent },
      { path: 'articles', component: AdminArticleManagerComponent },
      { path: 'article-categories', component: AdminArticleCategoryComponent },
      { path: 'article-authors', component: AdminArticleAuthorComponent },
      { path: '**', redirectTo: 'dashboard' }
    ]
  },
  { path: '**', redirectTo: '' }  // Wildcard route for 404 pages
];