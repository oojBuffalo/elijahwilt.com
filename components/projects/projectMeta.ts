import type {
  Project,
  ProjectCategory,
  ProjectStatus,
  ProjectType,
} from "@/lib/data";

/** File extension shown in the tree / editor tab, derived from project type. */
export function extensionFor(type: ProjectType): string {
  switch (type) {
    case "Computer Vision":
    case "NLP":
    case "Machine Learning":
      return ".ipynb";
    case "Hardware":
      return ".ino";
    case "Software":
    default:
      return ".py";
  }
}

/** snake_case the title for a terminal-authentic filename. */
function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");
}

/** Full `name.ext` filename for a project, e.g. `cottonweed_detection.ipynb`. */
export function fileNameFor(project: Project): string {
  return `${slugify(project.title)}${extensionFor(project.type)}`;
}

interface StatusMeta {
  label: string;
  /** Pill classes for the badge. */
  className: string;
  /** Whether to show the subtle pulsing dot (in-progress). */
  pulse: boolean;
}

/** Badge label + styling for a project status (defaults to "shipped"). */
export function statusMeta(status: ProjectStatus = "shipped"): StatusMeta {
  switch (status) {
    case "wip":
      return {
        label: "wip",
        className: "text-accent-cyan bg-accent-cyan/15",
        pulse: true,
      };
    case "archived":
      return {
        label: "archived",
        className: "text-text-secondary bg-border/40",
        pulse: false,
      };
    case "shipped":
    default:
      return {
        label: "shipped",
        className: "text-accent-green bg-accent-green/15",
        pulse: false,
      };
  }
}

/** Every project in the tree, depth-first, in display order. */
export function flattenProjects(tree: ProjectCategory[]): Project[] {
  const out: Project[] = [];
  for (const category of tree) {
    for (const project of category.projects ?? []) out.push(project);
    for (const dir of category.dirs ?? []) out.push(...dir.projects);
  }
  return out;
}

/** Project ids that are valid deep-link / selection targets (real, not placeholders). */
export function selectableIds(tree: ProjectCategory[]): Set<string> {
  return new Set(
    flattenProjects(tree)
      .filter((project) => !project.todo)
      .map((project) => project.id)
  );
}

/** All directory ids (categories + subdirs) for validating `?dirs=` values. */
export function collectDirIds(tree: ProjectCategory[]): Set<string> {
  const ids = new Set<string>();
  for (const category of tree) {
    ids.add(category.id);
    for (const dir of category.dirs ?? []) ids.add(dir.id);
  }
  return ids;
}

/**
 * Category + dir ids that contain at least one real (non-placeholder) project,
 * so the tree opens with actual work visible by default (empty "coming soon"
 * folders stay collapsed).
 */
export function defaultExpandedDirs(tree: ProjectCategory[]): Set<string> {
  const ids = new Set<string>();
  const hasReal = (projects?: Project[]) =>
    (projects ?? []).some((project) => !project.todo);
  for (const category of tree) {
    let categoryHasReal = hasReal(category.projects);
    for (const dir of category.dirs ?? []) {
      if (hasReal(dir.projects)) {
        ids.add(dir.id);
        categoryHasReal = true;
      }
    }
    if (categoryHasReal) ids.add(category.id);
  }
  return ids;
}

/** Ancestor directory ids of a project, so deep-links can auto-expand them. */
export function findPath(
  tree: ProjectCategory[],
  projectId: string
): string[] | null {
  for (const category of tree) {
    if ((category.projects ?? []).some((p) => p.id === projectId)) {
      return [category.id];
    }
    for (const dir of category.dirs ?? []) {
      if (dir.projects.some((p) => p.id === projectId)) {
        return [category.id, dir.id];
      }
    }
  }
  return null;
}
