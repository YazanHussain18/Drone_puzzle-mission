# Python Drone Mission Game

لعبة تعليمية تفاعلية مستوحاة من برنامج **Drone Rescue Mission** ومن نشاط **Broken Drone**.

## ماذا يفعل الطالب؟
1. يقرأ المشكلة.
2. يفكر في الحل.
3. يسحب أوامر تشبه Python إلى منطقة البرنامج.
4. يشغّل البرنامج.
5. يشاهد الدرون يتحرك داخل المحاكاة.
6. إذا فشل، يعمل Debug ويعيد المحاولة.

## المميزات
- 12 مستوى.
- الصعوبة تزيد كل 3 مستويات.
- Drag & Drop للأوامر.
- إعادة ترتيب الأوامر.
- تشغيل كامل أو خطوة بخطوة.
- عوائق ومسارات مختلفة.
- مستويات Debugging.
- مستويات Repeat / Loop.
- نجوم حسب عدد المحاولات.
- كود Python يظهر مباشرة بجانب البلوكات.
- واجهة بنفس الطابع البنفسجي/التركواز.
- لا تحتاج أي مكتبات خارجية.

## المراحل

### 1–3 — مبتدئ
Takeoff / Wait / Land / Forward / Turn

### 4–6 — مستكشف
عوائق + مسارات + Debug Mission

### 7–9 — مبرمج
Repeat + Loop + أقصر برنامج

### 10–12 — خبير
مهمات أطول وتخطيط أكثر

## الملفات
- `index.html`
- `styles.css`
- `game.js`
- `assets/`
- `.nojekyll`

## تشغيل محلي
يمكن فتح `index.html` مباشرة، أو تشغيل:

```bash
python -m http.server 8000
```

ثم افتح:

```text
http://localhost:8000
```

## GitHub Pages
1. أنشئ Repository جديد، مثلاً:
   `python-drone-mission`
2. ارفع محتويات المجلد إلى جذر الـ repository.
3. Settings → Pages
4. Deploy from a branch
5. اختر `main`
6. اختر `/root`
7. Save

سيصبح الرابط غالباً:

```text
https://YOUR_USERNAME.github.io/python-drone-mission/
```

## ملاحظة مهمة
المحاكاة نفسها تعمل بـ JavaScript لأن GitHub Pages لا يشغّل Python على الخادم.
لكن اللعبة تولّد وتعرض للطالب كود Python المكافئ، مثل:

```python
drone.takeoff()
drone.move_forward(50)
drone.rotate_clockwise(90)
drone.land()
```

وهذا يجعلها مناسبة جداً لشرح الانتقال:
Scratch → DroneBlocks → Python
