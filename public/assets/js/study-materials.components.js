(function () {
    function createElement(tagName, className, text) {
        var element = document.createElement(tagName);
        if (className) element.className = className;
        if (text !== undefined && text !== null) element.textContent = text;
        return element;
    }

    function renderTextList(items) {
        var list = createElement("ul", "study-list");
        items.forEach(function (item) {
            list.appendChild(createElement("li", "", item));
        });
        return list;
    }

    function renderStudyModuleCard(module) {
        var card = createElement("a", "card module-card is-available study-module-card");
        card.href = "material-estudo.html?moduleId=" + encodeURIComponent(module.id);
        card.dataset.studyModuleId = module.id;

        var main = createElement("div", "module-main");
        main.appendChild(createElement("div", "module-icon", String(module.id)));

        var content = createElement("div", "study-card-content");
        content.appendChild(createElement("h2", "", module.title));
        content.appendChild(createElement("p", "muted", module.subtitle));
        content.appendChild(createElement("p", "study-card-description", module.description));

        var meta = createElement("div", "module-meta");
        meta.appendChild(createElement("span", "badge badge-primary", "Leitura"));
        meta.appendChild(
            createElement(
                "span",
                "badge badge-muted",
                module.contents.length + " seções"
            )
        );
        content.appendChild(meta);

        main.appendChild(content);
        card.appendChild(main);
        return card;
    }

    function renderStudySection(section, index) {
        var article = createElement("article", "card study-content-card");
        article.appendChild(createElement("span", "badge badge-muted", "Seção " + (index + 1)));
        article.appendChild(createElement("h2", "", section.title));

        (section.paragraphs || []).forEach(function (paragraph) {
            article.appendChild(createElement("p", "study-paragraph", paragraph));
        });

        if (section.topics && section.topics.length) {
            article.appendChild(renderTextList(section.topics));
        }

        if (section.summary) {
            article.appendChild(createElement("p", "study-summary", section.summary));
        }

        return article;
    }

    window.StudyMaterialComponents = {
        createElement: createElement,
        renderStudyModuleCard: renderStudyModuleCard,
        renderStudySection: renderStudySection,
    };
})();
