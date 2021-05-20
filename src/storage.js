let storage = {
  apiKey: '77bcfa0d6a37794d5afd9b4b53e8de5d',
  listTypes: [
    {
      title: 'Популярные фильмы',
      shortTitle: 'Популярные',
      query: 'popular',
      type: 'collection',
      isCategory: true
    },
    {
      title: 'Лучшие фильмы',
      shortTitle: 'Лучшие фильмы',
      query: 'top_rated',
      type: 'collection',
      isCategory: true
    },
    {
      title: 'Скоро в прокате',
      shortTitle: 'Скоро в прокате',
      query: 'upcoming',
      type: 'collection',
      isCategory: true
    },
    {
      title: 'Сейчас в кинотеатрах',
      shortTitle: 'Сейчас в кинотеатрах',
      query: 'now_playing',
      type: 'collection',
      isCategory: true
    },
    // {
    //   title: 'Рекоммендации',
    //   shortTitle: 'Рекоммендации',
    //   query: 'recommendations',
    //   type: 'recommendations',
    //   isCategory: true
    // }
  ],
  categories: {}
};

// Create categories titles
storage.listTypes.forEach(function(listType){
  storage.categories[listType.query] = listType.title;
});

export default storage;
