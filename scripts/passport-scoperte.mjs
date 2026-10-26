// Preparatory read-only view model. Not loaded by the application until P0/art gates pass.
// Read normalized state.route directly: TopoRoute.record() creates missing records.
export const SCOPERTE_PAGES = Object.freeze([
  Object.freeze({ number: 3, side: 'left', title: 'SCOPERTE I', chapters: Object.freeze(['city1', 'city2', 'city3']) }),
  Object.freeze({ number: 4, side: 'right', title: 'SCOPERTE II', chapters: Object.freeze(['city4', 'islands', 'mountains']) })
]);

/** Pass the current normalized state.route and existing ROUTE_CHAPTERS; never raw backup data. */
export function scoperteView(route, chapters) {
  return SCOPERTE_PAGES.map(page => ({
    ...page,
    chapters: page.chapters.map(id => {
      const chapter = chapters.find(entry => entry.id === id);
      if (!chapter) throw new Error(`Missing canonical passport chapter: ${id}`);
      const record = route.chapters?.[id];
      const completed = record?.stage === 3;
      const gold = completed && record.goldAt > 0;
      return {
        id, title: chapter.title, completed, gold,
        status: completed ? 'Hoofdstuk afgerond' : 'Nog te ontdekken',
        goldStatus: gold ? 'Goud behaald' : 'Goud nog niet behaald',
        // No source path for Isole: completion remains valid while art is under rework.
        stampState: !completed ? 'unearned' : id === 'islands' ? 'awaiting-corrected-art' : 'earned',
        action: completed ? 'inspect' : 'learn'
      };
    })
  }));
}
