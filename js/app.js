window.eventStore = {
    events : JSON.parse( localStorage.getItem('event-store') || '[]' ),

    save(){
        localStorage.setItem('event-store', JSON.stringify(this.events));
    }
}

window.events = function(){
    return {

        ...eventStore,

        filter : 'select',

        title : '',
        message : '',
        date : '',
        place : '',
        year : '',
        
        yearData : [],
        selectedYear : 2022,

        createModal : false,
        editMode : false,
        delModal : false,
        cachedEvent : null,
        validationError : false,
        oldId : '',

        get years(){            

            var date = new Date();
            var currentYear = date.getFullYear();
            var i = 1;

            for (let y = currentYear; y >= 2015 ; y--) {
                var data = {};
                data['id'] = i;                
                data['year'] = y;
                this.yearData.push(data);
                i++;
            }            
            return this.yearData;
            
        },

        get total(){
            var num = this.filteredEvents.length;
            var event =  ( num == 1 ) ? 'Event' : 'Events';

            return `Total ${num} ${event} Found.`;
        },

        get selectedEvent(){
            this.yearData = [];
            return this.events.filter( event => event.year == this.selectedYear );
        },

        // get currentEvent(){            
        //     return this.events.filter( event => event.year == '2022' );
        // },

        get filteredEvents(){
          return{
            // current : this.currentEvent,
            select : this.selectedEvent,
          }[this.filter];
        },

        formEvent(){
            ( this.editMode == true ) ? this.editForm() : this.addEvent() ;
        },

        addEvent() {

            if( !this.validation() ) return;

            var todo = {};
            todo['id'] = Date.now();
            todo['title'] = this.title;
            todo['message'] = this.message;
            todo['date'] = this.date;
            todo['place'] = this.place;
            todo['year']  = this.getYear(this.date);                  

            // if ( Object.values(todo).some(x => x == '') ) return;

            this.events.push(todo);
            this.save();
            this.resetForm();
            this.createModal = false;
        },

        validation(){
            if( this.title && this.message && this.date && this.place ) return true;
            
            this.validationError = true;
        },

        editEvent(todo)  {
            console.log("Edit Event");
            this.createModal = true;
            this.editMode = true;
            this.title = todo.title;
            this.message = todo.message;
            this.date = todo.date;
            this.place = todo.place;
            
            this.oldId = todo.id;            
        },

        editForm(){
            
            if( !this.validation() ) return;

            objIndex = this.events.findIndex((obj => obj.id == this.oldId));            
            
            this.events[objIndex].title = this.title;
            this.events[objIndex].message = this.message;
            this.events[objIndex].date = this.date;
            this.events[objIndex].place = this.place;
            this.events[objIndex].year = this.getYear(this.date);

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
            let position = this.events.indexOf(this.cachedEvent);
            this.events.splice(position,1);
            this.save();
            this.delModal = false;
            this.cachedEvent = null;
        },

        resetForm(){
            this.title = '';
            this.message = '';
            this.date = '';
            this.place = '';
            this.validationError = false;
            // this.yearData = [];
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