window.eventStore = {
    todos : JSON.parse( localStorage.getItem('event-store') || '[]' ),

    save(){
        localStorage.setItem('event-store', JSON.stringify(this.todos));
    }
}


window.events = function(){
    return {

        ...eventStore,
        createModal : false,

        title : '',
        message : '',
        date : '',
        place : '',
        year : '',
        
        editMode : false,
        delModal : false,
        cachedEvent : null,
        // test : [],
        oldId : '',

        formEvent(){
            if( this.editMode == true ) this.editForm()
            this.addEvent()
        },

        addEvent() {
            var todo = {};
            todo['id'] = Date.now();
            todo['title'] = this.title;
            todo['message'] = this.message;
            todo['date'] = this.date;
            todo['place'] = this.title;
            todo['year']  = this.getYear(this.date);                  

            if ( Object.values(todo).some(x => x == '') ) return;

            this.todos.push(todo);
            this.save();
            this.resetForm();
            this.createModal = false;
        },

        editEvent(todo)  {
            console.log("Edit Event");
            this.createModal = true;
            this.editMode = true;
            this.title = todo.title;
            this.message = todo.message;
            this.date = todo.date;
            this.place = todo.place;
            this.year = this.getYear(todo.date);
            this.oldId = todo.id;            
        },

        editForm(){
            console.log("editing");

            objIndex = this.todos.findIndex((obj => obj.id == this.oldId));
            
            this.todos[objIndex].title = this.title;
            this.todos[objIndex].message = this.message;
            this.todos[objIndex].date = this.date;
            this.todos[objIndex].place = this.place;

            this.save();

            this.createModal = false;
            this.editMode = false;
            this.resetForm();
        },

        deleteEvent(todo){
            console.log("Delete Event");
            this.delModal = true;
            this.cachedEvent = todo;
            console.log(this.cachedEvent)
        },

        deleteConfirm(){
            let position = this.todos.indexOf(this.cachedEvent);
            this.todos.splice(position,1);
            this.save();
            this.delModal = false;
            this.cachedEvent = null;
        },

        resetForm(){
            this.title = '';
            this.message = '';
            this.date = '';
            this.place = '';
        },

        getMonth(date){
            var date = date.split('-')            
            return {
                '01' : 'Jan',
                '02' : 'Feb',
                '03' : 'Mar',
                '04' : 'Apr',
                '05' : 'May',
                '06' : 'Jun',
                '07' : 'Jul',
                '08' : 'Aug',
                '09' : 'Sep',
                '10' : 'Oct',
                '11' : 'Nov',
                '12' : 'Dec',
            }[date[1]];
        },

        getDay(date){
            var date = date.split('-')            
            return parseInt(date[2]);
        },
        
        getYear(date){
            var date = date.split('-')            
            return parseInt(date[0]);
        }
    }
}