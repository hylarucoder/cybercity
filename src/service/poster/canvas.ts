import { ALL_TEMPLATES } from "./template";
import { Readable } from "stream";
import { cloneDeep } from "lodash";

export function makePoster(template, content) {
  const newTmpl = Object.assign({}, template);
  if (newTmpl.background && content.background) {
    newTmpl.background = content.background;
  }
  for (const component of newTmpl.components) {
    if (Object.keys(content).includes(component.name)) {
      if (component.type === "image") {
        component.imageUrl = content[component.name];
      } else {
        component.content = content[component.name];
      }
    }
  }
  return newTmpl;
}

export function bufferToStream(binary) {
  return new Readable({
    read() {
      this.push(binary);
      this.push(null);
    },
  });
}

export function getTemplate(tmpl) {
  let template = ALL_TEMPLATES[tmpl];
  if (!template) {
    return false;
  }
  template = cloneDeep(template);
  return template;
}
