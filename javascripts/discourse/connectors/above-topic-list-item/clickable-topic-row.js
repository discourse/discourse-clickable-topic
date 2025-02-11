import Component from "@glimmer/component";
import { action } from "@ember/object";
import { service } from "@ember/service";
import { navigateToTopic } from "discourse/components/topic-list-item";
import { bind } from "discourse/lib/decorators";
import { wantsNewWindow } from "discourse/lib/intercept-click";

export default class extends Component {
  @service site;

  @bind
  clickHandler(event) {
    const targetElement = event.target;
    const topic = this.args.outletArgs.topic;

    const clickTargets = [
      "topic-list-data",
      "link-bottom-line",
      "topic-list-item",
    ];

    if (this.site.mobileView) {
      clickTargets.push("topic-item-metadata", "topic-item-stats");
    }

    if (clickTargets.some((t) => targetElement.classList.contains(t))) {
      if (wantsNewWindow(event)) {
        return true;
      }
      return navigateToTopic.call(this, topic, topic.lastUnreadUrl);
    }
  }

  @action
  registerClickHandler(element) {
    element.parentElement.addEventListener("click", this.clickHandler);
  }

  @action
  removeClickHandler(element) {
    element.parentElement.removeEventListener("click", this.clickHandler);
  }
}
