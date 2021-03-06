<div dir='rtl'>

# تقسیمات کشوری ایران :iran:
[مرکز آمار ایران](https://www.amar.org.ir/) فایل‌هایی شامل اطلاعات تقسیمات کشوری را در وب سایت خود منتشر می‌کند. آخرین فایل منتشر شده مربوط به سال ۱۳۹۸ است که در قالب اکسل 
از [این آدرس](https://www.amar.org.ir/Portals/0/Geo/GEO98.xlsx) قابل دریافت است.

این مخزن، تمام اطلاعات فایل اکسل تقسیمات کشوری از جمله آبادی‌ها را شامل می‌شود. از آنجایی که اطلاعات فایل اکسل مرکز آمار، نرمال نیست در این مخزن در حال حاضر در سه قالب `csv` و `json` و `sql`  اطلاعات به صورت نرمال شده با `relation` درج شده است.

:warning: آخرین نسخه عرضه شده این مخزن نسخه **2.x**‌ می‌باشد که تقسیمات کشوری سال ۱۳۹۸ را دارد. در نسخه **1.x** که آخرین عرضه آن [v1.0.1](https://github.com/Hameds/IranCountryDivisions/releases/tag/v1.0.1) می‌باشد تقسیمات کشوری سال ۱۳۹۷ را می‌توانید دریافت کنید که سازگار با تغییرات سال ۱۳۹۸ نیست.

:information_source: اطلاعات فایل اکسل مرکز آمار، از نظر حروف فارسی صحیح نیست و در این مخزن، یکسان‌سازی و تبدیل کاراکترها به کاراکترهای استاندارد فارسی هم انجام شده است.

### حمایت :pray:

در صورتی که این مخزن برای شما مفید است با Star دادن به آن یا با حمایت مالی به مبلغ دلخواه می‌توانید از این پروژه حمایت کنید. برای حمایت مالی روی دکمه Sponsor کلیک کنید یا به [صفحه حمایت مالی](https://payping.ir/@HamedBlog) بروید. لطفاً در بخش توضیحات صفحه حمایت مالی عبارت «مربوط به پروژه تقسیمات کشوری ایران» را درج کنید.


### تعاریف

- **استان** : واحدی از تقسیمات كشوری است با محدوده جفرافیایی معین، كه از به هم پیوستن چند شهرستان همجوار با توجه به موقعیت سیاسی، اجتماعی، فرهنگی، اقتصادی و طبیعی تشكیل می‌شود


- **شهرستان**: واحدی از تقسیمات كشوری است با محدوده جغرافیایی معین كه ار بهم پیوستن چند بخش همجوار كه از نظر عوامل طبیعی، اجتماعی، اقتصادی، سیاسی و فرهنگی واحد متناسب و همگنی را به وجود آورده‌اند.

- **بخش**: واحدی است از تقسیمات كشوری كه دارای محدوه جغرافیایی معین بوده و از به هم پیوستن چند دهستان همجوار مشتمل بر چندین مزرعه، مكان، روستا و احیاناً شهر كه در آن عوامل طبیعی و اوضاع اجتماعی، فرهنگی، اقتصادی و سیاسی واحد همگنی را به وجود می‌آورد به نحوی كه با در نظر گرفتن تناسب، وسعت، جمعیت، ارتباطات و دسترسی و سایر موقعیت‌ها، نیل به اهداف و برنامه‌ریزی‌های دولت در جهت احیاء امكانات طبیعی و استعدادهای اجتماعی و توسعه امور رفاهی و اقتصادی آن تسهیل گردد.

- **دهستان**: كوچك‌ترین واحد تقسیمات كشوری است كه دارای محدوده جغرافیایی معین بوده و از به هم پیوستن چند روستا، مكان، مزرعه همجوار تشكیل می‌شود كه از لحاظ محیط طبیعی، فرهنگی، اقتصادی و اجتماعی همگن بوده و امكان خدمات رسانی و برنامه‌ریزی در سیستم و شبكه واحدی را فراهم می‌نماید.

- **شهر**: شهر محلی است با حدود قانونی كه در محدوده جغرافیایی بخش واقع شده و از نظر بافت ساختمانی، اشتغال و سایر عوامل، دارای سیمائی با ویژگی‌های خاص خود بوده به طوری كه اكثریت ساكنان دائمی آن در مشاغل كسب، تجارت، صنعت، كشاورزی، خدمات و فعالیت‌های اداری اشتغال داشته و در زمینه خدمات شهری از خودكفایی نسبی برخوردار و كانون مبالات اجتماعی، اقتصادی، فرهنگی و سیاسی حوزه جذب و نفوذ پیرامون خود بوده و حداقل دارای ده هزار نفر جمعیت باشد.


### فرمت داده‌ها

هر ردیف از داده‌ها شامل ستون‌های زیر می‌باشد:

- `id`: شناسه ردیف 
- `parentCountryDivisionId`: شناسه پدر بر اساس تعاریف. به عنوان مثال، پدر یک ردیف از نوع «شهرستان»، ردیفی از نوع «استان» می‌باشد.
- `name`: نام محل
- `code`: کد محل بر اساس کدگذاری فایل اکسل مرکز آمار ایران
- `divisionType`: نوع ردیف شامل یکی از موارد زیر:
  - `0`: کشور
  - `1`: استان
  - `2`: شهرستان
  - `3`: بخش
  - `4`: دهستان
  - `5`: شهر
  - `6`: آبادی

</div>
