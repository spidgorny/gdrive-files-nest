$(() => {
    $(document).on('click', 'a.file', (e) => {
        e.preventDefault();
        const $this = $(e.currentTarget);
        const folderRow = $this.closest('.folder-row');
        const descDiv = folderRow.find('.descriptionDiv');
        console.log(descDiv);
        descDiv.load('getFileInfo', $.param({
            id: $this.attr('data-id')
        }));
    });
});
