import Component from "@glimmer/component";
import { action } from "@ember/object";
import { navigateToTopic } from "discourse/components/topic-list-item";
import { bind } from "discourse/lib/decorators";
import { wantsNewWindow } from "discourse/lib/intercept-click";

export default class extends Component {
  @bind
  clickHandler(event) {
    const targetElement = event.target;
    const topic = this.args.outletArgs.topic;

    if (targetElement.tagName === "DIV") {
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
