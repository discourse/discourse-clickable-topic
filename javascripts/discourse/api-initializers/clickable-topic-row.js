import { apiInitializer } from "discourse/lib/api";
import { wantsNewWindow } from "discourse/lib/intercept-click";

export default apiInitializer((api) => {
  api.registerBehaviorTransformer(
    "topic-list-item-click",
    ({ context, next }) => {
      const targetElement = context.event.target;
      const topic = context.topic;

      const clickTargets = [
        "topic-list-data",
        "link-bottom-line",
        "topic-list-item",
      ];

      if (api.container.lookup("service:site").mobileView) {
        clickTargets.push("topic-item-metadata", "topic-item-stats");
      }

      if (clickTargets.some((t) => targetElement.classList.contains(t))) {
        if (wantsNewWindow(event)) {
          return true;
        }
        return context.navigateToTopic(topic, topic.lastUnreadUrl);
      }

      next();
    }
  );
});
