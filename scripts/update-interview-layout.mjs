import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const indexPath = join(root, "src/index.html");

let html = readFileSync(indexPath, "utf8");

const gallery1 = `  <div class="ids__space XS"></div>
  <ids-gallery>
    <figure>
      <a href="/assets/interview-1/1.jpg"
        ><img src="/assets/interview-1/1.jpg" alt=""
      /></a>
    </figure>
    <figure>
      <a href="/assets/interview-2/2.jpg"
        ><img src="/assets/interview-2/2.jpg" alt=""
      /></a>
    </figure>
    <figure>
      <a href="/assets/interview-1/3.jpg"
        ><img src="/assets/interview-1/3.jpg" alt=""
      /></a>
    </figure>
    <figure>
      <a href="/assets/interview-1/4.jpg"
        ><img src="/assets/interview-1/4.jpg" alt=""
      /></a>
    </figure>
    <figure>
      <a href="/assets/interview-1/5.jpg"
        ><img src="/assets/interview-1/5.jpg" alt=""
      /></a>
    </figure>
  </ids-gallery>`;

// fix gallery1 - I made a mistake with interview-2/2 - use interview-1/2
const gallery1Fixed = gallery1.replace("interview-2/2", "interview-1/2");

const part1 = `  <div class="ids__text-width">
    <hgroup>
      <p class="post-date">20 июня 2026</p>
      <h2>А кто делает интерьеры Дринкит: часть 1</h2>
    </hgroup>
    <div class="ids__text-width">
      <div class="post-meta">
        <span class="post-meta__prefix">интервью взяла</span>
        <img
          class="post-meta__avatar"
          src="/assets/dilyara-kalinina-telyasheva.jpg"
          alt=""
          width="20"
          height="20" />
        <span class="post-meta__author">диляра калинина-теляшева</span>
        <span class="post-meta__sep">·</span>
        <span class="post-meta__prefix">на вопросы отвечал</span>
        <img
          class="post-meta__avatar"
          src="/assets/author.png"
          alt=""
          width="20"
          height="20" />
        <span class="post-meta__author"
          ><a
            href="https://t.me/nikitatugarin"
            target="_blank"
            rel="noopener noreferrer"
            >никита тугарин</a
          ></span
        >
        <span class="post-meta__sep">·</span>
        <span class="post-meta__tags">
          интервью, никита тугарин, интерьер, дизайн
        </span>
      </div>
    </div>
    <div class="ids__space M"></div>
    <p>
      Этот вопрос мне за&nbsp;последние пару недель задали 4 человека из&nbsp;модных компаний/стартапов.
    </p>
    <p>
      Знакомлю вас с&nbsp;Руководителем дизайна интерьеров Дринкит <a
        href="https://t.me/nikitatugarin"
        target="_blank"
        rel="noopener noreferrer"
        >Никитой Тугариным</a
      >. Хотелось сделать интервью полезным для вас, поэтому было решено не&nbsp;сокращать инфу и&nbsp;поделить ответы на&nbsp;3 выпуска 💙
    </p>
  </div>
  <div class="ids__text-width">
    <div class="interview-turn">
      <div class="interview-turn__speaker"><img
          class="interview-turn__avatar"
          src="/assets/dilyara-kalinina-telyasheva.jpg"
          alt=""
          width="48"
          height="48" /><span class="interview-turn__name">диляра</span></div>
      <div class="interview-turn__body">
        <p>Какими 3-мя твоими проектами до&nbsp;Дринкита ты гордишься больше всего?</p>
      </div>
    </div>
    <div class="interview-turn">
      <div class="interview-turn__speaker"><img
          class="interview-turn__avatar"
          src="/assets/author.png"
          alt=""
          width="48"
          height="48" /><span class="interview-turn__name">никита</span></div>
      <div class="interview-turn__body">
        <p>Один из&nbsp;моих главных проектов — создание архитектурного <a href="https://pravda.archi/" target="_blank" rel="noopener noreferrer">Бюро Правда</a>. Мы с&nbsp;двумя друзьями, не&nbsp;имея никакого предпринимательского опыта, научились позиционировать себя, продавать услуги, руководить людьми, выросли до&nbsp;команды примерно в&nbsp;30 человек, выстроили классную культуру и&nbsp;набили все шишки, которые только можно набить.</p>
        <p>Для меня это был не&nbsp;просто бизнес, а&nbsp;важный этап в&nbsp;жизни и&nbsp;большой многолетний проект, которым я&nbsp;очень горжусь. Бюро, кстати, до&nbsp;сих пор работает и&nbsp;отлично себя чувствует.</p>
        <p>Второй проект — небоскреб в&nbsp;<a href="https://www.som.com/projects/legend/" target="_blank" rel="noopener noreferrer">Гвадалахаре</a>, который мы разрабатывали в&nbsp;архитектурном бюро <a href="http://som.com/" target="_blank" rel="noopener noreferrer">SOM</a>. С&nbsp;одной стороны, это абсолютно глобалистский, почти архетипический вертикальный mixed-use с&nbsp;магазинами и&nbsp;отелем внизу, с&nbsp;офисами и&nbsp;жильем наверху.</p>
        <p>Собственно, именно SOM придумали формат вертикального mixed-use в&nbsp;60-х.</p>
        <p>С&nbsp;другой стороны — это проект, который мог родиться только в&nbsp;Гвадалахаре. Весь фасад — практически ручная работа местных подрядчиков из&nbsp;местных материалов. В&nbsp;общем, проект получился международным по&nbsp;масштабу с&nbsp;ярчайшим локальным характером. Ждем в&nbsp;учебниках архитектуры. Могу рассказывать часами, но&nbsp;это же блиц, так?</p>
        <p>Третий проект, ни&nbsp;много ни&nbsp;мало, — Лос-Анджелес. Представь, ты прилетаешь в&nbsp;город ангелов. Выходишь из&nbsp;самолета, садишься в&nbsp;вагон легкого метро и&nbsp;едешь через <a href="https://www.hntb.com/projects/los-angeles-international-airport-automated-people-mover-project/" target="_blank" rel="noopener noreferrer">станции</a>, которые я&nbsp;проектировал по&nbsp;путям, для которых я&nbsp;участвовал в&nbsp;разработке конструкций. Из&nbsp;окна смотришь на&nbsp;здание <a href="https://www.som.com/projects/lax-airport-police-facility/" target="_blank" rel="noopener noreferrer">полицейского участка аэропорта</a> — строгая, утилитарная, аскетичная, но&nbsp;выдающаяся архитектура. Тоже я. Дальше оказываешься в&nbsp;городе: вокруг стильные новые автобусные остановки вшитые в&nbsp;ДНК города — результат двух лет моей жизни, посвященных проектированию <a href="https://www.som.com/projects/los-angeles-bus-shelter-program/" target="_blank" rel="noopener noreferrer">адаптивной дизайн-системы</a> для трех тысяч остановок. А&nbsp;если через пару лет посмотришь с&nbsp;холмов на&nbsp;панораму Даунтауна, ее частью будет феноменальный mixed-used небоскреб <a href="https://www.som.com/projects/1111-sunset-boulevard/" target="_blank" rel="noopener noreferrer">1111 Sunset Boulevard</a> — мой первый проект в&nbsp;США. В&nbsp;общем, куда ни&nbsp;повернешь голову в&nbsp;ЛА — везде приложил руку. Горжусь этим от&nbsp;всей души, буду рассказывать внукам.</p>
      </div>
    </div>
    <div class="interview-turn">
      <div class="interview-turn__speaker"><img
          class="interview-turn__avatar"
          src="/assets/dilyara-kalinina-telyasheva.jpg"
          alt=""
          width="48"
          height="48" /><span class="interview-turn__name">диляра</span></div>
      <div class="interview-turn__body">
        <p>Теперь про Дринкит. В&nbsp;какие три кофейни нужно зайти, чтобы действительно удивиться крутости наших интерьеров?</p>
      </div>
    </div>
    <div class="interview-turn">
      <div class="interview-turn__speaker"><img
          class="interview-turn__avatar"
          src="/assets/author.png"
          alt=""
          width="48"
          height="48" /><span class="interview-turn__name">никита</span></div>
      <div class="interview-turn__body">
        <p>Во-первых, наши самые крутые кофейни пока даже не&nbsp;спроектированы. Во-вторых, крутость кофеен раскрывается с&nbsp;пониманием контекста. Это как хороший виски — вкуснее пить, когда знаешь историю бутылки. Или как невозможно, не&nbsp;зная контекст, понять в&nbsp;чем ценность «Черного квадрата» для истории культуры. В&nbsp;нашем случае, контекст — это, в&nbsp;том числе, безумно сжатые сроки на&nbsp;проект и, мягко говоря, аскетичный бюджет. Когда понимаешь в&nbsp;каких ограничениях рождаются эти пространства, по-другому на&nbsp;них смотришь.</p>
        <p>В&nbsp;любом случае, чем новее кофейня, тем она «круче». Если бы было иначе, я&nbsp;бы первый поставил под вопрос эффективность команды. Рекомендую сходить на&nbsp;Арбат, 1 — это недавно открытая, интересная на&nbsp;всех уровнях кофейня. Можно приходить регулярно и&nbsp;каждый раз замечать новые детали и&nbsp;сюжеты.</p>
        <p>Еще из&nbsp;новых я&nbsp;отмечу кофейни в&nbsp;ЖК «Слава» и&nbsp;на&nbsp;Красной Пресне, 38. В&nbsp;первой можно удивиться, но&nbsp;обойдусь без спойлеров. А&nbsp;вторая — отличный срез текущего уровня и&nbsp;подхода.</p>
      </div>
    </div>
    <div class="interview-turn">
      <div class="interview-turn__speaker"><img
          class="interview-turn__avatar"
          src="/assets/dilyara-kalinina-telyasheva.jpg"
          alt=""
          width="48"
          height="48" /><span class="interview-turn__name">диляра</span></div>
      <div class="interview-turn__body">
        <p>А&nbsp;крутой интерьер может повысить продажи? И&nbsp;как можно это понять на&nbsp;метриках?</p>
      </div>
    </div>
    <div class="interview-turn">
      <div class="interview-turn__speaker"><img
          class="interview-turn__avatar"
          src="/assets/author.png"
          alt=""
          width="48"
          height="48" /><span class="interview-turn__name">никита</span></div>
      <div class="interview-turn__body">
        <p>Хороший дизайн — по&nbsp;определению тот, за&nbsp;который люди платят деньги. Если зарабатываем, значит идём правильным путём. Но&nbsp;дизайн — это только одна из&nbsp;множества частей бизнес-модели, отдельно замерить его вклад невозможно.</p>
        <p>Когда я&nbsp;в&nbsp;прошлый раз пытался оцифровать архитектуру и&nbsp;ответить на&nbsp;похожие вопросы, то&nbsp;случайно написал бессовестно длинную статью на&nbsp;основе 43 источников и&nbsp;личных профессиональных откровений и&nbsp;регулярно возвращаюсь к&nbsp;этой теме у&nbsp;себя в&nbsp;<a href="https://t.me/nikitatugarin" target="_blank" rel="noopener noreferrer">канале</a>.</p>
        <p>В&nbsp;общем, простых ответов у&nbsp;меня нет.</p>
      </div>
    </div>
  </div>
${gallery1Fixed}

  <div class="ids__space XL"></div>`;

const gallery2 = `  <div class="ids__space XS"></div>
  <ids-gallery>
    <figure>
      <a href="/assets/interview-2/1.jpg"
        ><img src="/assets/interview-2/1.jpg" alt=""
      /></a>
    </figure>
    <figure>
      <a href="/assets/interview-2/2.jpg"
        ><img src="/assets/interview-2/2.jpg" alt=""
      /></a>
    </figure>
    <figure>
      <a href="/assets/interview-2/3.jpg"
        ><img src="/assets/interview-2/3.jpg" alt=""
      /></a>
    </figure>
    <figure>
      <a href="/assets/interview-2/4.jpg"
        ><img src="/assets/interview-2/4.jpg" alt=""
      /></a>
    </figure>
  </ids-gallery>`;

const part2 = `  <div class="ids__text-width">
    <hgroup>
      <p class="post-date">27 июня 2026</p>
      <h2>А кто делает интерьеры Дринкит: часть 2</h2>
    </hgroup>
    <div class="ids__text-width">
      <div class="post-meta">
        <span class="post-meta__prefix">интервью взяла</span>
        <img
          class="post-meta__avatar"
          src="/assets/dilyara-kalinina-telyasheva.jpg"
          alt=""
          width="20"
          height="20" />
        <span class="post-meta__author">диляра калинина-теляшева</span>
        <span class="post-meta__sep">·</span>
        <span class="post-meta__prefix">на вопросы отвечал</span>
        <img
          class="post-meta__avatar"
          src="/assets/author.png"
          alt=""
          width="20"
          height="20" />
        <span class="post-meta__author"
          ><a
            href="https://t.me/nikitatugarin"
            target="_blank"
            rel="noopener noreferrer"
            >никита тугарин</a
          ></span
        >
        <span class="post-meta__sep">·</span>
        <span class="post-meta__tags">
          интервью, никита тугарин, интерьер, дизайн
        </span>
      </div>
    </div>
    <div class="ids__space M"></div>
    <p>
      <strong>Диляра:</strong> Расскажи о&nbsp;том, как устроена твоя команда? Говорят, что у&nbsp;вас несколько групп, и&nbsp;они отличаются по&nbsp;стилю.
    </p>
    <p>
      <strong>Никита:</strong> У&nbsp;нас в&nbsp;отделе пять дизайн-команд. Четыре состоят из&nbsp;архитекторов, а&nbsp;пятая команда занимается технологией бара, где готовят ваши напитки. Ещё у&nbsp;нас есть команда поддержки: BIM-отдел, координатор, специалист по&nbsp;мебели, сметчик и&nbsp;я.
    </p>
    <p>
      Периодически подключаем внешние архитектурные команды для коллабораций, когда не&nbsp;хватает внутреннего ресурса — это отборные студии, близкие нам по&nbsp;духу и&nbsp;готовые работать с&nbsp;нашими ограничениями.
    </p>
    <p>
      У&nbsp;нас есть дизайн-система и&nbsp;методология, которые эволюционируют и&nbsp;помогают держать направление. Но&nbsp;какие бы крутые гайдлайны мы ни&nbsp;создали, средние кадры сделают по&nbsp;ним средний продукт. А&nbsp;посредственность мы себе позволить не&nbsp;можем — вот и&nbsp;наняли ярких личностей и&nbsp;высококлассных специалистов. А&nbsp;дальше всё логично — как личности ярки, так их проекты индивидуальны. В&nbsp;итоге команды разные по&nbsp;стилю коммуникации, чувству юмора и, конечно, архитектуре. Но&nbsp;главное — у&nbsp;всех получается делать Дринкит.
    </p>
    <p>
      <strong>Диляра:</strong> Я&nbsp;слышала про наши крутые авторские стулья в&nbsp;Дринките на&nbsp;Патриарших. Вы мебель тоже делаете сами?
    </p>
    <p>
      <strong>Никита:</strong> На&nbsp;рынке России нет красивых стульев, которые выдержат наш поток и&nbsp;которые стоят дешевле 30 тысяч рублей за&nbsp;штуку. Это (для нас) дорого. Красивых — полно, дешёвых — тоже. Есть даже износостойкие. А&nbsp;вот чтобы всё сразу — нет. Хватит это терпеть!
    </p>
    <p>
      С&nbsp;23-го года у&nbsp;меня были наработки по&nbsp;этому стулу. Мы их начали докручивать до&nbsp;сложности производства уровня «отрезал-прифигачил». Чтобы без сложных креплений, без утончённой деревообработки. Из&nbsp;материала, доступного в&nbsp;любой точке мира, с&nbsp;использованием технологий, понятных везде — чтобы можно было собрать его хоть в&nbsp;Москве, хоть в&nbsp;Мексике, с&nbsp;предсказуемым уровнем качества.
    </p>
    <p>
      На&nbsp;Патриках пока только прототип (да и&nbsp;тот пока без мягкой подушечки под попой) — после него случились уже минимум две итерации изменения пропорций для лучшей эргономики и&nbsp;повышения прочности.
    </p>
    <p>
      В&nbsp;общем, стул — это сложное инженерное сооружение, и, чтобы мы хакнули его за&nbsp;половину ранее озвученной стоимости, нам ещё придётся поработать.
    </p>
    <p>
      <strong>Диляра:</strong> А&nbsp;правда ли, что мы переиспользуем материалы в&nbsp;кофейнях?
    </p>
    <p>
      <strong>Никита:</strong> Мы действительно переиспользуем всякое. Например, из&nbsp;обрезков металла после производства умной выдачи делаем полки, бра, декоративные элементы. Но, если честно, это далеко не&nbsp;самое интересное, что мы делаем с&nbsp;точки зрения разумного потребления.
    </p>
    <p>
      Например, мы сейчас обновили матрицу стеновых панелей из&nbsp;фанеры и&nbsp;нержавейки и&nbsp;привязались к&nbsp;реальным размерам исходных материалов. Так теперь из&nbsp;заготовки можно вырезать ровно четыре стеновые панели без обрезков. Нашим производствам не&nbsp;придётся ничего выкидывать. Или вот: выкройки наших крючков для одежды раскладываются по&nbsp;заготовке, так сказать, «валетиком» — вообще без обрезков.
    </p>
    <p>
      Но&nbsp;и&nbsp;это не&nbsp;главное. А&nbsp;главное вот что: самый экологичный интерьер — не&nbsp;тот, который сделан из&nbsp;переработанного пластика и&nbsp;без обрезков, а&nbsp;тот, который не&nbsp;надо переделывать через пять лет. Поэтому, например, наш «рецепт» обработки стали позволяет восстанавливать её до&nbsp;первозданного состояния бесконечное количество раз. И&nbsp;поэтому мы стремимся делать «немодные» интерьеры вне времени, которые не&nbsp;потеряют актуальность.
    </p>
    <p>
      И, кстати, не&nbsp;всякий переработанный материал автоматически экологичнее. Иногда на&nbsp;его производство тратится столько усилий, энергии и&nbsp;логистики, что разумность его использования становится гораздо менее очевидной. Поэтому, если ты видишь у&nbsp;нас в&nbsp;кофейне столешницу из&nbsp;переработанного пластика, это, скорее всего, просто потому, что она прикольно выглядит.
    </p>
    <p>
      <strong>Диляра:</strong> Твоя самая главная амбиция в&nbsp;Дринките. Что даст тебе ощущение — блин, вот это высший пилотаж?
    </p>
    <p>
      <strong>Никита:</strong> У&nbsp;нас самая сильная в&nbsp;мире архитектурная команда внутри бизнеса. Амбиция — через действия рассказать об&nbsp;этом всем.
    </p>
  </div>
${gallery2}

  <div class="ids__space XL"></div>`;

const part1Start = html.indexOf("<h2>А кто делает интерьеры Дринкит: часть 1</h2>");
const part1BlockStart = html.lastIndexOf("<div class=\"ids__text-width\">", part1Start);
const moscowStart = html.indexOf("<h2>Тайна третьей планеты");
const moscowBlockStart = html.lastIndexOf(
  "<div class=\"ids__text-width\">",
  moscowStart,
);

const before = html.slice(0, part1BlockStart);
const after = html.slice(moscowBlockStart);

html = before + part1 + part2 + after;

writeFileSync(indexPath, html);

// sync index-test
const testPath = join(root, "src/index-test.html");
const testHeader = readFileSync(testPath, "utf8").split("{% block content %}")[0] + "{% block content %}\n\n";
const testBody = html.replace(/^[\s\S]*?{% block content %}\s*/, "");
writeFileSync(testPath, testHeader + testBody);

console.log("Updated interview parts 1 and 2, removed part 3");
