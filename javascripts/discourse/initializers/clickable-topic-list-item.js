import { withPluginApi } from "discourse/lib/plugin-api";
import { wantsNewWindow } from "discourse/lib/intercept-click";

export default {
  name: "clickable-topic-list-item",

  initialize() {
    withPluginApi("0.8.14", api => {
      api.modifyClass("component:topic-list-item", {
        click(event) {
          const result = this.showEntrance(event);
          
          if (result === false) return result;

          const topic = this.topic;
          const target = $(event.target);

          if (target.hasClass("bulk-select")) {
            const selected = this.selected;

            if (target.is(":checked")) {
              selected.addObject(topic);
            } else {
              selected.removeObject(topic);
            }
          }

          if (target.hasClass("raw-topic-link")) {
            if (wantsNewWindow(event)) {
              return true;
            }
            return this.navigateToTopic(topic, target.attr("href"))
          }

          console.log(target);
          // make full row click target on Desktop
          if (target.is("td") || target.hasClass("link-bottom-line") || target.is("tr")) {
            if (wantsNewWindow(event)) {
              return true;
            }
            return this.navigateToTopic(topic, topic.lastUnreadUrl);
          }

          // make full row click target on mobile
          if (target.hasClass("right") || target.hasClass("clearfix")) {
            if (wantsNewWindow(event)) {
              return true;
            }
            return this.navigateToTopic(topic, topic.lastUnreadUrl);
          }

          if (target.closest("a.topic-status").length === 1) {
            this.topic.togglePinnedForUser();
            return false;
          }

          return this.unhandledRowClick(event, topic);
        }
      });

      api.modifyClass("component:latest-topic-list-item", {
        click(event) {
          // for discourse events, undefined has a different meaning than false
          if (this.showEntrance(event) === false) return false;

          const topic = this.topic;
          const target = $(event.target);

          // make full row click target
          if (target.is("div")) {
            if (wantsNewWindow(event)) {
              return true;
            }
            return this.navigateToTopic(topic, topic.lastUnreadUrl);
          }

          return this.unhandledRowClick(event, this.topic);
        }
      })
    });
  }
};
