
class Store {
    constructor() {
        this.available = false;
        try {
            if (typeof window !== 'undefined' && 'localStorage' in window && window['localStorage'] !== null) {
                let key = '__pushtell_react__';
                window.localStorage.setItem(key, key);
                if (window.localStorage.getItem(key) === key) {
                    window.localStorage.removeItem(key);
                    this.available = true;
                }
            }
        } catch (e) {
        }
    }
    getItem(key) {
        if (this.available) {
            return window.localStorage.getItem(key)
        }
    }
    setItem(key, value) {
        if (this.available) {
            window.localStorage.setItem(key, value)

        }
    }
    clear() {
        if (this.available) {
            window.localStorage.clear()
        }
    }

}

export default new Store();
