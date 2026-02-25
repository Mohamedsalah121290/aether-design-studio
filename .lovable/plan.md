

# خطة التنفيذ - من الأهم للمهم (بدون Stripe)

## المرحلة 1: قسم إدارة الاشتراكات في الداشبورد (الأهم)

حالياً الداشبورد يعرض الطلبات فقط ومفيش أي طريقة للمستخدم يدير اشتراكاته.

### التغييرات:
- **`src/pages/Dashboard.tsx`**: إضافة قسم "اشتراكاتي" فوق قائمة الطلبات يستدعي `check-subscription` Edge Function ويعرض:
  - اسم الأداة + حالة الاشتراك (نشط/ملغي)
  - تاريخ التجديد القادم
  - زرار "إدارة الاشتراك" يستدعي `customer-portal` Edge Function ويفتح Stripe Portal

---

## المرحلة 2: Academy ديناميكية (مهم جداً)

الدروس كلها hardcoded والجداول (`courses`, `lessons`, `user_progress`) فاضية.

### التغييرات:
- **Migration**: إضافة seed data (3-4 دورات مع دروس) في جداول `courses` و `lessons`
- **`src/pages/Academy.tsx`**: استبدال المصفوفة الثابتة بـ `supabase.from('courses')` و `supabase.from('lessons')` مع استخدام `user_progress` بدل `localStorage`
- **`src/pages/AdminPage.tsx`**: إضافة تاب "Academy" لإدارة الدورات والدروس (CRUD)

---

## المرحلة 3: صفحة بروفايل المستخدم

مفيش صفحة بروفايل والمستخدم مش قادر يشوف بياناته.

### التغييرات:
- **`src/pages/Profile.tsx`** (جديد): صفحة تعرض الإيميل، تاريخ التسجيل، عدد الأدوات، تاريخ المشتريات
- **`src/components/Navbar.tsx`**: تحويل عرض اسم المستخدم لرابط يوصل `/profile`
- **`src/App.tsx`**: إضافة route `/profile` محمي بـ `ProtectedRoute`

---

## المرحلة 4: تطوير صفحة Admin

حالياً الأدمن يشوف الطلبات بس، ومفيش إدارة للأدوات أو إحصائيات.

### التغييرات:
- **Migration**: إضافة RLS policies للأدمن على جدول `tools` (INSERT, UPDATE, DELETE)
- **`src/pages/AdminPage.tsx`**: إضافة tabs:
  - "Orders" (موجود)
  - "Tools" - إدارة الأدوات (إضافة/تعديل/إخفاء)
  - "Stats" - إحصائيات بسيطة (عدد الطلبات، الإيرادات)

---

## المرحلة 5: إصلاح الروابط المكسورة + تحسينات

### التغييرات:
- **`src/components/Footer.tsx`**: ربط Security و Cookies بصفحات فعلية أو دمجهم في Privacy/Terms
- **Product/Company links**: توجيه الروابط الـ `#` لأقسام موجودة فعلاً أو إزالتها
- **`index.html`**: إصلاح og:image المفقودة

---

## الترتيب التقني للتنفيذ

```text
1. Dashboard subscriptions section (check-subscription + customer-portal integration)
2. Academy dynamic (migration + frontend + admin CRUD)
3. Profile page (new page + navbar link + route)
4. Admin enhancements (tools CRUD + stats + migration)
5. Footer/SEO fixes
```

كل مرحلة مستقلة ويمكن اختبارها منفردة. هنبدأ من المرحلة 1 ونكمل بالترتيب.

