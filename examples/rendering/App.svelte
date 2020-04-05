<script>
    import ExtendedTable from "../../src/ExtendedTable.svelte";
    import {default as data} from '../../fixtures/fixtures.json';

    let columnDefinition = [
        {
            title: 'Username',
            propertyPath: 'username',
        },
        {
            title: 'Name',
            value: (rowData) => `${rowData.title} ${rowData.first_name} ${rowData.last_name}`,
            propertyPath: 'last_name',
        },
        {
            title: 'Location',
            propertyPath: 'location.postcode',
        },
    ];

    let rows = data.slice(0, 10);

    const getGenderIcon = (person) => {
        return person.gender === 'male' ? '&#9794;' : '&#9792;';
    };

    const getBirthday = (person) => {
        if (!person.birthdate) {
            return "Unknown";
        }

        let birthday = new Date(person.birthdate * 1000);
        return birthday.toLocaleDateString();
    };
</script>

<ExtendedTable columns={columnDefinition} data={rows}>
    <!-- Since we are operating on the original data, we can as for gender here -->
    <div slot="column-2" let:data={person}>
        {@html getGenderIcon(person)} {person.first_name} {person.last_name}
    </div>
    <tr slot="additionalRow" let:rowData={person}>
       <td colspan="3">
           Birthday: {getBirthday(person)}; Email: {person.email}
       </td>
    </tr>
</ExtendedTable>