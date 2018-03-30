ListPage = ({ items }) => (
	<List items={items} />
)

TablePage = ({ items, count }) => (
	<Table items count />
)

DetailsPage = ({ item }) => (

)

```
FormPage = formHOC(api.update)( ({ data, onSubmit }) => (
	<form onSubmit={}>
	</form>
) )
```