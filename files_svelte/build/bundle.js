
(function(l, r) { if (!l || l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (self.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(self.document);
var app = (function () {
    'use strict';

    function noop() { }
    const identity = x => x;
    function assign(tar, src) {
        // @ts-ignore
        for (const k in src)
            tar[k] = src[k];
        return tar;
    }
    function add_location(element, file, line, column, char) {
        element.__svelte_meta = {
            loc: { file, line, column, char }
        };
    }
    function run(fn) {
        return fn();
    }
    function blank_object() {
        return Object.create(null);
    }
    function run_all(fns) {
        fns.forEach(run);
    }
    function is_function(thing) {
        return typeof thing === 'function';
    }
    function safe_not_equal(a, b) {
        return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
    }
    let src_url_equal_anchor;
    function src_url_equal(element_src, url) {
        if (!src_url_equal_anchor) {
            src_url_equal_anchor = document.createElement('a');
        }
        src_url_equal_anchor.href = url;
        return element_src === src_url_equal_anchor.href;
    }
    function is_empty(obj) {
        return Object.keys(obj).length === 0;
    }
    function validate_store(store, name) {
        if (store != null && typeof store.subscribe !== 'function') {
            throw new Error(`'${name}' is not a store with a 'subscribe' method`);
        }
    }
    function subscribe(store, ...callbacks) {
        if (store == null) {
            return noop;
        }
        const unsub = store.subscribe(...callbacks);
        return unsub.unsubscribe ? () => unsub.unsubscribe() : unsub;
    }
    function component_subscribe(component, store, callback) {
        component.$$.on_destroy.push(subscribe(store, callback));
    }
    function create_slot(definition, ctx, $$scope, fn) {
        if (definition) {
            const slot_ctx = get_slot_context(definition, ctx, $$scope, fn);
            return definition[0](slot_ctx);
        }
    }
    function get_slot_context(definition, ctx, $$scope, fn) {
        return definition[1] && fn
            ? assign($$scope.ctx.slice(), definition[1](fn(ctx)))
            : $$scope.ctx;
    }
    function get_slot_changes(definition, $$scope, dirty, fn) {
        if (definition[2] && fn) {
            const lets = definition[2](fn(dirty));
            if ($$scope.dirty === undefined) {
                return lets;
            }
            if (typeof lets === 'object') {
                const merged = [];
                const len = Math.max($$scope.dirty.length, lets.length);
                for (let i = 0; i < len; i += 1) {
                    merged[i] = $$scope.dirty[i] | lets[i];
                }
                return merged;
            }
            return $$scope.dirty | lets;
        }
        return $$scope.dirty;
    }
    function update_slot_base(slot, slot_definition, ctx, $$scope, slot_changes, get_slot_context_fn) {
        if (slot_changes) {
            const slot_context = get_slot_context(slot_definition, ctx, $$scope, get_slot_context_fn);
            slot.p(slot_context, slot_changes);
        }
    }
    function get_all_dirty_from_scope($$scope) {
        if ($$scope.ctx.length > 32) {
            const dirty = [];
            const length = $$scope.ctx.length / 32;
            for (let i = 0; i < length; i++) {
                dirty[i] = -1;
            }
            return dirty;
        }
        return -1;
    }
    function set_store_value(store, ret, value) {
        store.set(value);
        return ret;
    }
    function action_destroyer(action_result) {
        return action_result && is_function(action_result.destroy) ? action_result.destroy : noop;
    }

    const is_client = typeof window !== 'undefined';
    let now = is_client
        ? () => window.performance.now()
        : () => Date.now();
    let raf = is_client ? cb => requestAnimationFrame(cb) : noop;

    const tasks = new Set();
    function run_tasks(now) {
        tasks.forEach(task => {
            if (!task.c(now)) {
                tasks.delete(task);
                task.f();
            }
        });
        if (tasks.size !== 0)
            raf(run_tasks);
    }
    /**
     * Creates a new task that runs on each raf frame
     * until it returns a falsy value or is aborted
     */
    function loop(callback) {
        let task;
        if (tasks.size === 0)
            raf(run_tasks);
        return {
            promise: new Promise(fulfill => {
                tasks.add(task = { c: callback, f: fulfill });
            }),
            abort() {
                tasks.delete(task);
            }
        };
    }
    function append(target, node) {
        target.appendChild(node);
    }
    function get_root_for_style(node) {
        if (!node)
            return document;
        const root = node.getRootNode ? node.getRootNode() : node.ownerDocument;
        if (root && root.host) {
            return root;
        }
        return node.ownerDocument;
    }
    function append_empty_stylesheet(node) {
        const style_element = element('style');
        append_stylesheet(get_root_for_style(node), style_element);
        return style_element.sheet;
    }
    function append_stylesheet(node, style) {
        append(node.head || node, style);
        return style.sheet;
    }
    function insert(target, node, anchor) {
        target.insertBefore(node, anchor || null);
    }
    function detach(node) {
        if (node.parentNode) {
            node.parentNode.removeChild(node);
        }
    }
    function destroy_each(iterations, detaching) {
        for (let i = 0; i < iterations.length; i += 1) {
            if (iterations[i])
                iterations[i].d(detaching);
        }
    }
    function element(name) {
        return document.createElement(name);
    }
    function svg_element(name) {
        return document.createElementNS('http://www.w3.org/2000/svg', name);
    }
    function text(data) {
        return document.createTextNode(data);
    }
    function space() {
        return text(' ');
    }
    function empty() {
        return text('');
    }
    function listen(node, event, handler, options) {
        node.addEventListener(event, handler, options);
        return () => node.removeEventListener(event, handler, options);
    }
    function prevent_default(fn) {
        return function (event) {
            event.preventDefault();
            // @ts-ignore
            return fn.call(this, event);
        };
    }
    function self$1(fn) {
        return function (event) {
            // @ts-ignore
            if (event.target === this)
                fn.call(this, event);
        };
    }
    function attr(node, attribute, value) {
        if (value == null)
            node.removeAttribute(attribute);
        else if (node.getAttribute(attribute) !== value)
            node.setAttribute(attribute, value);
    }
    function init_binding_group(group) {
        let _inputs;
        return {
            /* push */ p(...inputs) {
                _inputs = inputs;
                _inputs.forEach(input => group.push(input));
            },
            /* remove */ r() {
                _inputs.forEach(input => group.splice(group.indexOf(input), 1));
            }
        };
    }
    function to_number(value) {
        return value === '' ? null : +value;
    }
    function children(element) {
        return Array.from(element.childNodes);
    }
    function set_input_value(input, value) {
        input.value = value == null ? '' : value;
    }
    function set_style(node, key, value, important) {
        if (value == null) {
            node.style.removeProperty(key);
        }
        else {
            node.style.setProperty(key, value, important ? 'important' : '');
        }
    }
    function select_option(select, value, mounting) {
        for (let i = 0; i < select.options.length; i += 1) {
            const option = select.options[i];
            if (option.__value === value) {
                option.selected = true;
                return;
            }
        }
        if (!mounting || value !== undefined) {
            select.selectedIndex = -1; // no option should be selected
        }
    }
    function select_value(select) {
        const selected_option = select.querySelector(':checked');
        return selected_option && selected_option.__value;
    }
    function toggle_class(element, name, toggle) {
        element.classList[toggle ? 'add' : 'remove'](name);
    }
    function custom_event(type, detail, { bubbles = false, cancelable = false } = {}) {
        const e = document.createEvent('CustomEvent');
        e.initCustomEvent(type, bubbles, cancelable, detail);
        return e;
    }

    // we need to store the information for multiple documents because a Svelte application could also contain iframes
    // https://github.com/sveltejs/svelte/issues/3624
    const managed_styles = new Map();
    let active = 0;
    // https://github.com/darkskyapp/string-hash/blob/master/index.js
    function hash(str) {
        let hash = 5381;
        let i = str.length;
        while (i--)
            hash = ((hash << 5) - hash) ^ str.charCodeAt(i);
        return hash >>> 0;
    }
    function create_style_information(doc, node) {
        const info = { stylesheet: append_empty_stylesheet(node), rules: {} };
        managed_styles.set(doc, info);
        return info;
    }
    function create_rule(node, a, b, duration, delay, ease, fn, uid = 0) {
        const step = 16.666 / duration;
        let keyframes = '{\n';
        for (let p = 0; p <= 1; p += step) {
            const t = a + (b - a) * ease(p);
            keyframes += p * 100 + `%{${fn(t, 1 - t)}}\n`;
        }
        const rule = keyframes + `100% {${fn(b, 1 - b)}}\n}`;
        const name = `__svelte_${hash(rule)}_${uid}`;
        const doc = get_root_for_style(node);
        const { stylesheet, rules } = managed_styles.get(doc) || create_style_information(doc, node);
        if (!rules[name]) {
            rules[name] = true;
            stylesheet.insertRule(`@keyframes ${name} ${rule}`, stylesheet.cssRules.length);
        }
        const animation = node.style.animation || '';
        node.style.animation = `${animation ? `${animation}, ` : ''}${name} ${duration}ms linear ${delay}ms 1 both`;
        active += 1;
        return name;
    }
    function delete_rule(node, name) {
        const previous = (node.style.animation || '').split(', ');
        const next = previous.filter(name
            ? anim => anim.indexOf(name) < 0 // remove specific animation
            : anim => anim.indexOf('__svelte') === -1 // remove all Svelte animations
        );
        const deleted = previous.length - next.length;
        if (deleted) {
            node.style.animation = next.join(', ');
            active -= deleted;
            if (!active)
                clear_rules();
        }
    }
    function clear_rules() {
        raf(() => {
            if (active)
                return;
            managed_styles.forEach(info => {
                const { ownerNode } = info.stylesheet;
                // there is no ownerNode if it runs on jsdom.
                if (ownerNode)
                    detach(ownerNode);
            });
            managed_styles.clear();
        });
    }

    let current_component;
    function set_current_component(component) {
        current_component = component;
    }
    function get_current_component() {
        if (!current_component)
            throw new Error('Function called outside component initialization');
        return current_component;
    }
    /**
     * The `onMount` function schedules a callback to run as soon as the component has been mounted to the DOM.
     * It must be called during the component's initialisation (but doesn't need to live *inside* the component;
     * it can be called from an external module).
     *
     * `onMount` does not run inside a [server-side component](/docs#run-time-server-side-component-api).
     *
     * https://svelte.dev/docs#run-time-svelte-onmount
     */
    function onMount(fn) {
        get_current_component().$$.on_mount.push(fn);
    }
    /**
     * Schedules a callback to run immediately before the component is unmounted.
     *
     * Out of `onMount`, `beforeUpdate`, `afterUpdate` and `onDestroy`, this is the
     * only one that runs inside a server-side component.
     *
     * https://svelte.dev/docs#run-time-svelte-ondestroy
     */
    function onDestroy(fn) {
        get_current_component().$$.on_destroy.push(fn);
    }
    // TODO figure out if we still want to support
    // shorthand events, or if we want to implement
    // a real bubbling mechanism
    function bubble(component, event) {
        const callbacks = component.$$.callbacks[event.type];
        if (callbacks) {
            // @ts-ignore
            callbacks.slice().forEach(fn => fn.call(this, event));
        }
    }

    const dirty_components = [];
    const binding_callbacks = [];
    let render_callbacks = [];
    const flush_callbacks = [];
    const resolved_promise = /* @__PURE__ */ Promise.resolve();
    let update_scheduled = false;
    function schedule_update() {
        if (!update_scheduled) {
            update_scheduled = true;
            resolved_promise.then(flush);
        }
    }
    function add_render_callback(fn) {
        render_callbacks.push(fn);
    }
    function add_flush_callback(fn) {
        flush_callbacks.push(fn);
    }
    // flush() calls callbacks in this order:
    // 1. All beforeUpdate callbacks, in order: parents before children
    // 2. All bind:this callbacks, in reverse order: children before parents.
    // 3. All afterUpdate callbacks, in order: parents before children. EXCEPT
    //    for afterUpdates called during the initial onMount, which are called in
    //    reverse order: children before parents.
    // Since callbacks might update component values, which could trigger another
    // call to flush(), the following steps guard against this:
    // 1. During beforeUpdate, any updated components will be added to the
    //    dirty_components array and will cause a reentrant call to flush(). Because
    //    the flush index is kept outside the function, the reentrant call will pick
    //    up where the earlier call left off and go through all dirty components. The
    //    current_component value is saved and restored so that the reentrant call will
    //    not interfere with the "parent" flush() call.
    // 2. bind:this callbacks cannot trigger new flush() calls.
    // 3. During afterUpdate, any updated components will NOT have their afterUpdate
    //    callback called a second time; the seen_callbacks set, outside the flush()
    //    function, guarantees this behavior.
    const seen_callbacks = new Set();
    let flushidx = 0; // Do *not* move this inside the flush() function
    function flush() {
        // Do not reenter flush while dirty components are updated, as this can
        // result in an infinite loop. Instead, let the inner flush handle it.
        // Reentrancy is ok afterwards for bindings etc.
        if (flushidx !== 0) {
            return;
        }
        const saved_component = current_component;
        do {
            // first, call beforeUpdate functions
            // and update components
            try {
                while (flushidx < dirty_components.length) {
                    const component = dirty_components[flushidx];
                    flushidx++;
                    set_current_component(component);
                    update(component.$$);
                }
            }
            catch (e) {
                // reset dirty state to not end up in a deadlocked state and then rethrow
                dirty_components.length = 0;
                flushidx = 0;
                throw e;
            }
            set_current_component(null);
            dirty_components.length = 0;
            flushidx = 0;
            while (binding_callbacks.length)
                binding_callbacks.pop()();
            // then, once components are updated, call
            // afterUpdate functions. This may cause
            // subsequent updates...
            for (let i = 0; i < render_callbacks.length; i += 1) {
                const callback = render_callbacks[i];
                if (!seen_callbacks.has(callback)) {
                    // ...so guard against infinite loops
                    seen_callbacks.add(callback);
                    callback();
                }
            }
            render_callbacks.length = 0;
        } while (dirty_components.length);
        while (flush_callbacks.length) {
            flush_callbacks.pop()();
        }
        update_scheduled = false;
        seen_callbacks.clear();
        set_current_component(saved_component);
    }
    function update($$) {
        if ($$.fragment !== null) {
            $$.update();
            run_all($$.before_update);
            const dirty = $$.dirty;
            $$.dirty = [-1];
            $$.fragment && $$.fragment.p($$.ctx, dirty);
            $$.after_update.forEach(add_render_callback);
        }
    }
    /**
     * Useful for example to execute remaining `afterUpdate` callbacks before executing `destroy`.
     */
    function flush_render_callbacks(fns) {
        const filtered = [];
        const targets = [];
        render_callbacks.forEach((c) => fns.indexOf(c) === -1 ? filtered.push(c) : targets.push(c));
        targets.forEach((c) => c());
        render_callbacks = filtered;
    }

    let promise;
    function wait() {
        if (!promise) {
            promise = Promise.resolve();
            promise.then(() => {
                promise = null;
            });
        }
        return promise;
    }
    function dispatch(node, direction, kind) {
        node.dispatchEvent(custom_event(`${direction ? 'intro' : 'outro'}${kind}`));
    }
    const outroing = new Set();
    let outros;
    function group_outros() {
        outros = {
            r: 0,
            c: [],
            p: outros // parent group
        };
    }
    function check_outros() {
        if (!outros.r) {
            run_all(outros.c);
        }
        outros = outros.p;
    }
    function transition_in(block, local) {
        if (block && block.i) {
            outroing.delete(block);
            block.i(local);
        }
    }
    function transition_out(block, local, detach, callback) {
        if (block && block.o) {
            if (outroing.has(block))
                return;
            outroing.add(block);
            outros.c.push(() => {
                outroing.delete(block);
                if (callback) {
                    if (detach)
                        block.d(1);
                    callback();
                }
            });
            block.o(local);
        }
        else if (callback) {
            callback();
        }
    }
    const null_transition = { duration: 0 };
    function create_bidirectional_transition(node, fn, params, intro) {
        const options = { direction: 'both' };
        let config = fn(node, params, options);
        let t = intro ? 0 : 1;
        let running_program = null;
        let pending_program = null;
        let animation_name = null;
        function clear_animation() {
            if (animation_name)
                delete_rule(node, animation_name);
        }
        function init(program, duration) {
            const d = (program.b - t);
            duration *= Math.abs(d);
            return {
                a: t,
                b: program.b,
                d,
                duration,
                start: program.start,
                end: program.start + duration,
                group: program.group
            };
        }
        function go(b) {
            const { delay = 0, duration = 300, easing = identity, tick = noop, css } = config || null_transition;
            const program = {
                start: now() + delay,
                b
            };
            if (!b) {
                // @ts-ignore todo: improve typings
                program.group = outros;
                outros.r += 1;
            }
            if (running_program || pending_program) {
                pending_program = program;
            }
            else {
                // if this is an intro, and there's a delay, we need to do
                // an initial tick and/or apply CSS animation immediately
                if (css) {
                    clear_animation();
                    animation_name = create_rule(node, t, b, duration, delay, easing, css);
                }
                if (b)
                    tick(0, 1);
                running_program = init(program, duration);
                add_render_callback(() => dispatch(node, b, 'start'));
                loop(now => {
                    if (pending_program && now > pending_program.start) {
                        running_program = init(pending_program, duration);
                        pending_program = null;
                        dispatch(node, running_program.b, 'start');
                        if (css) {
                            clear_animation();
                            animation_name = create_rule(node, t, running_program.b, running_program.duration, 0, easing, config.css);
                        }
                    }
                    if (running_program) {
                        if (now >= running_program.end) {
                            tick(t = running_program.b, 1 - t);
                            dispatch(node, running_program.b, 'end');
                            if (!pending_program) {
                                // we're done
                                if (running_program.b) {
                                    // intro — we can tidy up immediately
                                    clear_animation();
                                }
                                else {
                                    // outro — needs to be coordinated
                                    if (!--running_program.group.r)
                                        run_all(running_program.group.c);
                                }
                            }
                            running_program = null;
                        }
                        else if (now >= running_program.start) {
                            const p = now - running_program.start;
                            t = running_program.a + running_program.d * easing(p / running_program.duration);
                            tick(t, 1 - t);
                        }
                    }
                    return !!(running_program || pending_program);
                });
            }
        }
        return {
            run(b) {
                if (is_function(config)) {
                    wait().then(() => {
                        // @ts-ignore
                        config = config(options);
                        go(b);
                    });
                }
                else {
                    go(b);
                }
            },
            end() {
                clear_animation();
                running_program = pending_program = null;
            }
        };
    }

    function bind(component, name, callback) {
        const index = component.$$.props[name];
        if (index !== undefined) {
            component.$$.bound[index] = callback;
            callback(component.$$.ctx[index]);
        }
    }
    function create_component(block) {
        block && block.c();
    }
    function mount_component(component, target, anchor, customElement) {
        const { fragment, after_update } = component.$$;
        fragment && fragment.m(target, anchor);
        if (!customElement) {
            // onMount happens before the initial afterUpdate
            add_render_callback(() => {
                const new_on_destroy = component.$$.on_mount.map(run).filter(is_function);
                // if the component was destroyed immediately
                // it will update the `$$.on_destroy` reference to `null`.
                // the destructured on_destroy may still reference to the old array
                if (component.$$.on_destroy) {
                    component.$$.on_destroy.push(...new_on_destroy);
                }
                else {
                    // Edge case - component was destroyed immediately,
                    // most likely as a result of a binding initialising
                    run_all(new_on_destroy);
                }
                component.$$.on_mount = [];
            });
        }
        after_update.forEach(add_render_callback);
    }
    function destroy_component(component, detaching) {
        const $$ = component.$$;
        if ($$.fragment !== null) {
            flush_render_callbacks($$.after_update);
            run_all($$.on_destroy);
            $$.fragment && $$.fragment.d(detaching);
            // TODO null out other refs, including component.$$ (but need to
            // preserve final state?)
            $$.on_destroy = $$.fragment = null;
            $$.ctx = [];
        }
    }
    function make_dirty(component, i) {
        if (component.$$.dirty[0] === -1) {
            dirty_components.push(component);
            schedule_update();
            component.$$.dirty.fill(0);
        }
        component.$$.dirty[(i / 31) | 0] |= (1 << (i % 31));
    }
    function init(component, options, instance, create_fragment, not_equal, props, append_styles, dirty = [-1]) {
        const parent_component = current_component;
        set_current_component(component);
        const $$ = component.$$ = {
            fragment: null,
            ctx: [],
            // state
            props,
            update: noop,
            not_equal,
            bound: blank_object(),
            // lifecycle
            on_mount: [],
            on_destroy: [],
            on_disconnect: [],
            before_update: [],
            after_update: [],
            context: new Map(options.context || (parent_component ? parent_component.$$.context : [])),
            // everything else
            callbacks: blank_object(),
            dirty,
            skip_bound: false,
            root: options.target || parent_component.$$.root
        };
        append_styles && append_styles($$.root);
        let ready = false;
        $$.ctx = instance
            ? instance(component, options.props || {}, (i, ret, ...rest) => {
                const value = rest.length ? rest[0] : ret;
                if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
                    if (!$$.skip_bound && $$.bound[i])
                        $$.bound[i](value);
                    if (ready)
                        make_dirty(component, i);
                }
                return ret;
            })
            : [];
        $$.update();
        ready = true;
        run_all($$.before_update);
        // `false` as a special case of no DOM component
        $$.fragment = create_fragment ? create_fragment($$.ctx) : false;
        if (options.target) {
            if (options.hydrate) {
                const nodes = children(options.target);
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.l(nodes);
                nodes.forEach(detach);
            }
            else {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.c();
            }
            if (options.intro)
                transition_in(component.$$.fragment);
            mount_component(component, options.target, options.anchor, options.customElement);
            flush();
        }
        set_current_component(parent_component);
    }
    /**
     * Base class for Svelte components. Used when dev=false.
     */
    class SvelteComponent {
        $destroy() {
            destroy_component(this, 1);
            this.$destroy = noop;
        }
        $on(type, callback) {
            if (!is_function(callback)) {
                return noop;
            }
            const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
            callbacks.push(callback);
            return () => {
                const index = callbacks.indexOf(callback);
                if (index !== -1)
                    callbacks.splice(index, 1);
            };
        }
        $set($$props) {
            if (this.$$set && !is_empty($$props)) {
                this.$$.skip_bound = true;
                this.$$set($$props);
                this.$$.skip_bound = false;
            }
        }
    }

    function dispatch_dev(type, detail) {
        document.dispatchEvent(custom_event(type, Object.assign({ version: '3.59.2' }, detail), { bubbles: true }));
    }
    function append_dev(target, node) {
        dispatch_dev('SvelteDOMInsert', { target, node });
        append(target, node);
    }
    function insert_dev(target, node, anchor) {
        dispatch_dev('SvelteDOMInsert', { target, node, anchor });
        insert(target, node, anchor);
    }
    function detach_dev(node) {
        dispatch_dev('SvelteDOMRemove', { node });
        detach(node);
    }
    function listen_dev(node, event, handler, options, has_prevent_default, has_stop_propagation, has_stop_immediate_propagation) {
        const modifiers = options === true ? ['capture'] : options ? Array.from(Object.keys(options)) : [];
        if (has_prevent_default)
            modifiers.push('preventDefault');
        if (has_stop_propagation)
            modifiers.push('stopPropagation');
        if (has_stop_immediate_propagation)
            modifiers.push('stopImmediatePropagation');
        dispatch_dev('SvelteDOMAddEventListener', { node, event, handler, modifiers });
        const dispose = listen(node, event, handler, options);
        return () => {
            dispatch_dev('SvelteDOMRemoveEventListener', { node, event, handler, modifiers });
            dispose();
        };
    }
    function attr_dev(node, attribute, value) {
        attr(node, attribute, value);
        if (value == null)
            dispatch_dev('SvelteDOMRemoveAttribute', { node, attribute });
        else
            dispatch_dev('SvelteDOMSetAttribute', { node, attribute, value });
    }
    function prop_dev(node, property, value) {
        node[property] = value;
        dispatch_dev('SvelteDOMSetProperty', { node, property, value });
    }
    function set_data_dev(text, data) {
        data = '' + data;
        if (text.data === data)
            return;
        dispatch_dev('SvelteDOMSetData', { node: text, data });
        text.data = data;
    }
    function validate_each_argument(arg) {
        if (typeof arg !== 'string' && !(arg && typeof arg === 'object' && 'length' in arg)) {
            let msg = '{#each} only iterates over array-like objects.';
            if (typeof Symbol === 'function' && arg && Symbol.iterator in arg) {
                msg += ' You can use a spread to convert this iterable into an array.';
            }
            throw new Error(msg);
        }
    }
    function validate_slots(name, slot, keys) {
        for (const slot_key of Object.keys(slot)) {
            if (!~keys.indexOf(slot_key)) {
                console.warn(`<${name}> received an unexpected slot "${slot_key}".`);
            }
        }
    }
    function construct_svelte_component_dev(component, props) {
        const error_message = 'this={...} of <svelte:component> should specify a Svelte component.';
        try {
            const instance = new component(props);
            if (!instance.$$ || !instance.$set || !instance.$on || !instance.$destroy) {
                throw new Error(error_message);
            }
            return instance;
        }
        catch (err) {
            const { message } = err;
            if (typeof message === 'string' && message.indexOf('is not a constructor') !== -1) {
                throw new Error(error_message);
            }
            else {
                throw err;
            }
        }
    }
    /**
     * Base class for Svelte components with some minor dev-enhancements. Used when dev=true.
     */
    class SvelteComponentDev extends SvelteComponent {
        constructor(options) {
            if (!options || (!options.target && !options.$$inline)) {
                throw new Error("'target' is a required option");
            }
            super();
        }
        $destroy() {
            super.$destroy();
            this.$destroy = () => {
                console.warn('Component was already destroyed'); // eslint-disable-line no-console
            };
        }
        $capture_state() { }
        $inject_state() { }
    }

    const subscriber_queue = [];
    /**
     * Create a `Writable` store that allows both updating and reading by subscription.
     * @param {*=}value initial value
     * @param {StartStopNotifier=} start
     */
    function writable(value, start = noop) {
        let stop;
        const subscribers = new Set();
        function set(new_value) {
            if (safe_not_equal(value, new_value)) {
                value = new_value;
                if (stop) { // store is ready
                    const run_queue = !subscriber_queue.length;
                    for (const subscriber of subscribers) {
                        subscriber[1]();
                        subscriber_queue.push(subscriber, value);
                    }
                    if (run_queue) {
                        for (let i = 0; i < subscriber_queue.length; i += 2) {
                            subscriber_queue[i][0](subscriber_queue[i + 1]);
                        }
                        subscriber_queue.length = 0;
                    }
                }
            }
        }
        function update(fn) {
            set(fn(value));
        }
        function subscribe(run, invalidate = noop) {
            const subscriber = [run, invalidate];
            subscribers.add(subscriber);
            if (subscribers.size === 1) {
                stop = start(set) || noop;
            }
            run(value);
            return () => {
                subscribers.delete(subscriber);
                if (subscribers.size === 0 && stop) {
                    stop();
                    stop = null;
                }
            };
        }
        return { set, update, subscribe };
    }

    const NetworkStates = {loading: "LOADING", loaded: "LOADED", error: "ERROR"};

    const fileTypes = [
        "image/apng",
        "image/bmp",
        "image/gif",
        "image/jpeg",
        "image/pjpeg",
        "image/png",
        "image/svg+xml",
        "image/tiff",
        "image/webp",
        "image/x-icon"
    ];

    const user_verification_status = {verified: "VERIFIED", unverified: "UNVERIFIED", verifying: "VERIFYING", failed: "FAILED"};

    function loadCharts() {
    	var charts = document.querySelectorAll('[data-bss-chart]');

    	for (var chart of charts) {
            let dataset = JSON.parse(chart.dataset.bssChart);
            dataset.options = {...dataset.options, "plugins": {  // Moved tooltips under plugins
                    "tooltip": {  // Notice it's singular, not plural
                        "callbacks": {
                            "label": function(ctx) {
                                console.log("tooltip callback");
                                let label = ctx.label || '';
                                let value = ctx.raw;
        
                                if (value < 0) {
                                    value = 0;
                                }
        
                                return label + ': ' + value;
                            }
                        }
                    }
                }};
            console.log(dataset);
    		chart.chart = new Chart(chart, dataset);
    	}
    }

    function fetchLineChartData() {
        return JSON.stringify({
            "type": "line",
            "data": {
                "labels": ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug"],
                "datasets": [
                    {
                        "label": "Earnings",
                        "fill": true,
                        "data": ["0", "10000", "5000", "15000", "10000", "20000", "15000", "25000"],
                        "backgroundColor": "rgba(78, 115, 223, 0.05)",
                        "borderColor": "rgba(78, 115, 223, 1)"
                    }
                ]
            },
            "options": {
                "maintainAspectRatio": false,
                "legend": {
                    "display": false,
                    "labels": {
                        "fontStyle": "normal"
                    }
                },
                "title": {
                    "fontStyle": "normal"
                },
                "scales": {
                    "xAxes": [
                        {
                        "gridLines": {
                            "color": "rgb(234, 236, 244)",
                            "zeroLineColor": "rgb(234, 236, 244)",
                            "drawBorder": false,
                            "drawTicks": false,
                            "borderDash": ["2"],
                            "zeroLineBorderDash": ["2"],
                            "drawOnChartArea": false
                        },
                        "ticks": {
                            "fontColor": "#858796",
                            "fontStyle": "normal",
                            "padding": 20
                        }
                        }
                    ],
                    "yAxes": [
                        {
                            "gridLines": {
                                "color": "rgb(234, 236, 244)",
                                "zeroLineColor": "rgb(234, 236, 244)",
                                "drawBorder": false,
                                "drawTicks": false,
                                "borderDash": ["2"],
                                "zeroLineBorderDash": ["2"]
                            },
                            "ticks": {
                                "fontColor": "#858796",
                                "fontStyle": "normal",
                                "padding": 20
                            }
                        }
                    ]
                }
            }
        });
    }

    function fetchDoughnutChart(referal, earning, bonus) {
        console.log(`referral: ${referal}, earnings: ${earning}, bonus: ${bonus}`);
        return JSON.stringify({
            "type": "doughnut",
            "data": {
                "labels": ["Referral", "Gains", "Bonus"],
                "datasets": [
                    {
                        "label": "sources",
                        "backgroundColor": ["#4e73df", "#1cc88a", "#36b9cc"],
                        "borderColor": ["#ffffff", "#ffffff", "#ffffff"],
                        "borderWidth": 2,
                        "data": [(referal || -1), (earning || -1), (bonus || -1)]
                    }
                ]
            },
            "options": {
                "maintainAspectRatio": false,
                "legend": {
                    "display": false,
                    "labels": {
                        "fontStyle": "normal"
                    }
                },
                "title": {
                    "fontStyle": "normal"
                },
            }
        });
    }

    function transformPaymentValue(value) {
        if (value === "usdt_trx") {
            return "usdt trc"
        } else if (value === "usdt_eth") {
            return "usdt eth"
        } else {
            return value
        }
    }

    function alertUser(
        title,
        text,
        icon = "info"
    ) {
        Swal.fire({title, text, icon});
    }

    const fetchAndSendDataWithJson = async (path, data = null, requestMethod = 'GET') => {
        let json = (data === null ? data : JSON.stringify(data));

        try {
            let response = await fetch(/*`http://localhost:3010${path}`*/path, {
                method: requestMethod,
                credentials: 'include',
                body: json,
                headers: {
                    'Content-Type': 'application/json',
                    "fetch-data": "true"
                }
            });
            let result = await response.json();
            return result;
        } catch (error) {
            console.log(error);
            return {status: false, message: "Unable to reach server", data: {}}
        }
    };

    const fetchAndSendDataWithJsonAndQuery = async (path, query, data = null, requestMethod = 'GET') => {
        const sortedCheck = (query || {});
        let queryString = `${path}?`;
        Object.entries(sortedCheck).forEach(([key, value], index) => {
            if (index > 0) {
                queryString = `${queryString}&${key}=${value}`;
            } else {
                queryString = `${queryString}${key}=${value}`;
            }
        });
        let result = await fetchAndSendDataWithJson(queryString, data, requestMethod);
        return result;
    };

    const sendDataAndFile = async (path, data, additionalData = null) => {
        let formData = new FormData(data);
        Object.entries((additionalData || {})).forEach(([key, value]) => {
            formData.append(key, value);
        });

        try{
            let response = await fetch(/*`http://localhost:3010${path}`*/path, {
                method: 'POST',
                credentials: 'include',
                body: formData
            });
            let result = await response.json();
            return result;
        }catch (error){
            console.log(error);
            return {status: false, message: "Unable to reach server", data: {}}
        }
    };

    // export async function fakeLogin() {
    //     let response = await fetchAndSendDataWithJson("/login", {
    //         "email": "support@adikob.com",
    //         "password": "12345678",
    //         "remember": true
    //     }, 'POST');
    //     console.log(response); 
    // }

    function formatUTCDateToYrMntDay(utcDateString) {
        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        const date = new Date(utcDateString);
        return date.toLocaleDateString(undefined, options);
    }

    function formatUTCDate(utcDateString) {
        const date = new Date(utcDateString);
      
        // Get the individual components
        const optionsDay = { weekday: 'short' };
        const optionsDate = { month: 'long', day: 'numeric', year: 'numeric' };
        const optionsTime = { hour: 'numeric', minute: 'numeric', hour12: true };
      
        const day = new Intl.DateTimeFormat(undefined, optionsDay).format(date);
        const datePart = new Intl.DateTimeFormat(undefined, optionsDate).format(date);
        const timePart = new Intl.DateTimeFormat(undefined, optionsTime).format(date).toLowerCase();
      
        // Combine parts into desired format
        return `${day} ${datePart} ${timePart}`;
    }

    function isStringEmptyOrWhitespace(str) {
        return str.trim() === '';
    }

    function changeLanguage(lang) {
        try {
            // var selectField = document.querySelector('iframe.goog-te-banner-frame').contentWindow.document.querySelector('.goog-te-menu-frame').contentWindow.document.querySelector('.goog-te-combo');
            // selectField.value = lang;
            // selectField.dispatchEvent(new Event('change'));

            if (lang) {
                var googleTranslateElement = document.getElementsByClassName("goog-te-combo")[0];
                sessionStorage.setItem('selectedLanguage', lang);
                if (googleTranslateElement) {
                    googleTranslateElement.value = lang;
                    googleTranslateElement.dispatchEvent(new Event('change'));
                }
            }
        } catch (error) {
            console.log(error);
        }
    }
      
    const basicDetails = writable({email: "", firstname: "", lastname: "", picture: "", date: "", language: "", currency: "", ref_code: "", paymentMethods: []});

    function actualCurrency(value) {
        if (value === "usd") {
            return "$";
        } else if (value === "eur") {
            return "€"
        } else {
            return "£"
        }
    }

    function referralLink(value, isReferral = true) {
        const displayText = isReferral ? "Referral link copied!" : 'Wallet address copied';
        const copyText = isReferral ? `https://cputrades.com/register?ref=${value}` : value;
        navigator.clipboard.writeText(copyText);
        Swal.fire({
            position: "top-end",
            icon: "success",
            title: displayText,
            showConfirmButton: false,
            timer: 1500
        });
    }

    async function updateEmail(email) {
        Swal.fire({
            title: 'A code was sent to the email address you provided. Use it to complete email update',
            input: "text",
            inputAttributes: {
              autocapitalize: "off"
            },
            showCancelButton: true,
            confirmButtonText: "Confirm",
            showLoaderOnConfirm: true,
            preConfirm: async (code) => {
              try {
                let response = await fetchAndSendDataWithJson('/update-email', {email, code}, 'POST');
                if (!response.status) {
                    return Swal.showValidationMessage(response.message);
                } else {
                    basicDetails.update(d => {
                        d.email = email;
                        return {...d};
                    });
                    return response
                }
              } catch (error) {
                console.log(error);
                Swal.showValidationMessage(`Request failed: ${error.message}`);
              }
            },
            allowOutsideClick: () => !Swal.isLoading()
            }).then(async(async_result) => {
                alertUser('', async_result.message, success);
            });
    }

    /* src\components\DashboardFooter.svelte generated by Svelte v3.59.2 */
    const file$n = "src\\components\\DashboardFooter.svelte";

    function create_fragment$n(ctx) {
    	let footer;
    	let div1;
    	let div0;
    	let span;
    	let t0;
    	let t1;
    	let t2;
    	let a;
    	let i;

    	const block = {
    		c: function create() {
    			footer = element("footer");
    			div1 = element("div");
    			div0 = element("div");
    			span = element("span");
    			t0 = text("Copyright © CPU Trades ");
    			t1 = text(/*year*/ ctx[0]);
    			t2 = space();
    			a = element("a");
    			i = element("i");
    			add_location(span, file$n, 8, 51, 277);
    			attr_dev(div0, "class", "text-center my-auto copyright");
    			add_location(div0, file$n, 8, 8, 234);
    			attr_dev(div1, "class", "container my-auto");
    			add_location(div1, file$n, 7, 4, 193);
    			attr_dev(footer, "class", "sticky-footer footer");
    			add_location(footer, file$n, 6, 0, 150);
    			attr_dev(i, "class", "fas fa-angle-up");
    			add_location(i, file$n, 11, 66, 416);
    			attr_dev(a, "class", "border rounded d-inline scroll-to-top");
    			attr_dev(a, "href", "#page-top");
    			add_location(a, file$n, 11, 0, 350);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, footer, anchor);
    			append_dev(footer, div1);
    			append_dev(div1, div0);
    			append_dev(div0, span);
    			append_dev(span, t0);
    			append_dev(span, t1);
    			insert_dev(target, t2, anchor);
    			insert_dev(target, a, anchor);
    			append_dev(a, i);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*year*/ 1) set_data_dev(t1, /*year*/ ctx[0]);
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(footer);
    			if (detaching) detach_dev(t2);
    			if (detaching) detach_dev(a);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$n.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$n($$self, $$props, $$invalidate) {
    	let year;
    	let $basicDetails;
    	validate_store(basicDetails, 'basicDetails');
    	component_subscribe($$self, basicDetails, $$value => $$invalidate(1, $basicDetails = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('DashboardFooter', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<DashboardFooter> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({ basicDetails, year, $basicDetails });

    	$$self.$inject_state = $$props => {
    		if ('year' in $$props) $$invalidate(0, year = $$props.year);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*$basicDetails*/ 2) {
    			$$invalidate(0, year = new Date($basicDetails.date).getFullYear());
    		}
    	};

    	return [year, $basicDetails];
    }

    class DashboardFooter extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$n, create_fragment$n, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "DashboardFooter",
    			options,
    			id: create_fragment$n.name
    		});
    	}
    }

    /* src\components\DashboardNavigator.svelte generated by Svelte v3.59.2 */

    const file$m = "src\\components\\DashboardNavigator.svelte";

    function create_fragment$m(ctx) {
    	let nav;
    	let div3;
    	let a0;
    	let div0;
    	let img;
    	let img_src_value;
    	let t0;
    	let div1;
    	let span0;
    	let t2;
    	let hr;
    	let t3;
    	let ul;
    	let li0;
    	let a1;
    	let i0;
    	let span1;
    	let t5;
    	let li1;
    	let a2;
    	let i1;
    	let span2;
    	let t7;
    	let li2;
    	let a3;
    	let i2;
    	let span3;
    	let t9;
    	let li3;
    	let a4;
    	let i3;
    	let span4;
    	let t11;
    	let li4;
    	let a5;
    	let i4;
    	let span5;
    	let t13;
    	let li5;
    	let a6;
    	let i5;
    	let span6;
    	let t15;
    	let li6;
    	let a7;
    	let i6;
    	let span7;
    	let t17;
    	let li7;
    	let t18;
    	let div2;
    	let button;
    	let t19;
    	let script;
    	let script_src_value;

    	const block = {
    		c: function create() {
    			nav = element("nav");
    			div3 = element("div");
    			a0 = element("a");
    			div0 = element("div");
    			img = element("img");
    			t0 = space();
    			div1 = element("div");
    			span0 = element("span");
    			span0.textContent = "CPU TRADES";
    			t2 = space();
    			hr = element("hr");
    			t3 = space();
    			ul = element("ul");
    			li0 = element("li");
    			a1 = element("a");
    			i0 = element("i");
    			span1 = element("span");
    			span1.textContent = "Home";
    			t5 = space();
    			li1 = element("li");
    			a2 = element("a");
    			i1 = element("i");
    			span2 = element("span");
    			span2.textContent = "Profile";
    			t7 = space();
    			li2 = element("li");
    			a3 = element("a");
    			i2 = element("i");
    			span3 = element("span");
    			span3.textContent = "Transactions";
    			t9 = space();
    			li3 = element("li");
    			a4 = element("a");
    			i3 = element("i");
    			span4 = element("span");
    			span4.textContent = "Deposit";
    			t11 = space();
    			li4 = element("li");
    			a5 = element("a");
    			i4 = element("i");
    			span5 = element("span");
    			span5.textContent = "Withdraw";
    			t13 = space();
    			li5 = element("li");
    			a6 = element("a");
    			i5 = element("i");
    			span6 = element("span");
    			span6.textContent = " Purchase Plan";
    			t15 = space();
    			li6 = element("li");
    			a7 = element("a");
    			i6 = element("i");
    			span7 = element("span");
    			span7.textContent = "Settings";
    			t17 = space();
    			li7 = element("li");
    			t18 = space();
    			div2 = element("div");
    			button = element("button");
    			t19 = space();
    			script = element("script");
    			if (!src_url_equal(img.src, img_src_value = "/img/logo.jpg")) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "logo");
    			set_style(img, "max-height", "60px");
    			set_style(img, "max-width", "60px");
    			add_location(img, file$m, 14, 44, 517);
    			attr_dev(div0, "class", "sidebar-brand-icon");
    			add_location(div0, file$m, 14, 12, 485);
    			add_location(span0, file$m, 15, 49, 652);
    			attr_dev(div1, "class", "sidebar-brand-text mx-3");
    			add_location(div1, file$m, 15, 12, 615);
    			attr_dev(a0, "class", "navbar-brand d-flex justify-content-center align-items-center sidebar-brand m-0");
    			attr_dev(a0, "href", "#");
    			add_location(a0, file$m, 13, 8, 371);
    			attr_dev(hr, "class", "sidebar-divider my-0");
    			add_location(hr, file$m, 17, 8, 705);
    			attr_dev(i0, "class", "fas fa-home");
    			add_location(i0, file$m, 19, 91, 897);
    			add_location(span1, file$m, 19, 118, 924);
    			attr_dev(a1, "class", "nav-link " + /*activeNav*/ ctx[0]("home"));
    			attr_dev(a1, "href", "/dashboard");
    			add_location(a1, file$m, 19, 33, 839);
    			attr_dev(li0, "class", "nav-item");
    			add_location(li0, file$m, 19, 12, 818);
    			attr_dev(i1, "class", "fas fa-user");
    			add_location(i1, file$m, 20, 92, 1044);
    			add_location(span2, file$m, 20, 119, 1071);
    			attr_dev(a2, "class", "nav-link " + /*activeNav*/ ctx[0]("profile"));
    			attr_dev(a2, "href", "/profile");
    			add_location(a2, file$m, 20, 33, 985);
    			attr_dev(li1, "class", "nav-item");
    			add_location(li1, file$m, 20, 12, 964);
    			attr_dev(i2, "class", "fas fa-table");
    			add_location(i2, file$m, 21, 102, 1204);
    			add_location(span3, file$m, 21, 130, 1232);
    			attr_dev(a3, "class", "nav-link " + /*activeNav*/ ctx[0]("transactions"));
    			attr_dev(a3, "href", "/transactions");
    			add_location(a3, file$m, 21, 33, 1135);
    			attr_dev(li2, "class", "nav-item");
    			add_location(li2, file$m, 21, 12, 1114);
    			attr_dev(i3, "class", "fas fa-download");
    			add_location(i3, file$m, 22, 92, 1360);
    			add_location(span4, file$m, 22, 123, 1391);
    			attr_dev(a4, "class", "nav-link " + /*activeNav*/ ctx[0]("deposit"));
    			attr_dev(a4, "href", "/deposit");
    			add_location(a4, file$m, 22, 33, 1301);
    			attr_dev(li3, "class", "nav-item");
    			add_location(li3, file$m, 22, 12, 1280);
    			attr_dev(i4, "class", "fas fa-building");
    			add_location(i4, file$m, 23, 94, 1516);
    			add_location(span5, file$m, 23, 125, 1547);
    			attr_dev(a5, "class", "nav-link " + /*activeNav*/ ctx[0]("withdraw"));
    			attr_dev(a5, "href", "/withdraw");
    			add_location(a5, file$m, 23, 33, 1455);
    			attr_dev(li4, "class", "nav-item");
    			add_location(li4, file$m, 23, 12, 1434);
    			add_location(span6, file$m, 24, 129, 1708);
    			attr_dev(i5, "class", "fas fa-plus-square");
    			add_location(i5, file$m, 24, 99, 1678);
    			attr_dev(a6, "class", "nav-link " + /*activeNav*/ ctx[0]("purchase"));
    			attr_dev(a6, "href", "/purchase-plan");
    			add_location(a6, file$m, 24, 33, 1612);
    			attr_dev(li5, "class", "nav-item");
    			add_location(li5, file$m, 24, 12, 1591);
    			attr_dev(i6, "class", "fas fa-cogs");
    			add_location(i6, file$m, 25, 94, 1845);
    			add_location(span7, file$m, 25, 121, 1872);
    			attr_dev(a7, "class", "nav-link " + /*activeNav*/ ctx[0]("settings"));
    			attr_dev(a7, "href", "/settings");
    			add_location(a7, file$m, 25, 33, 1784);
    			attr_dev(li6, "class", "nav-item");
    			add_location(li6, file$m, 25, 12, 1763);
    			attr_dev(li7, "class", "nav-item");
    			add_location(li7, file$m, 26, 12, 1916);
    			attr_dev(ul, "class", "navbar-nav text-light");
    			attr_dev(ul, "id", "accordionSidebar");
    			add_location(ul, file$m, 18, 8, 748);
    			attr_dev(button, "class", "btn rounded-circle border-0");
    			attr_dev(button, "id", "sidebarToggle");
    			attr_dev(button, "type", "button");
    			add_location(button, file$m, 28, 52, 2011);
    			attr_dev(div2, "class", "text-center d-none d-md-inline");
    			add_location(div2, file$m, 28, 8, 1967);
    			attr_dev(div3, "class", "container-fluid d-flex flex-column p-0");
    			add_location(div3, file$m, 12, 4, 309);
    			if (!src_url_equal(script.src, script_src_value = "/assets/js/theme.js")) attr_dev(script, "src", script_src_value);
    			add_location(script, file$m, 31, 4, 2123);
    			attr_dev(nav, "class", "navbar align-items-start sidebar sidebar-dark accordion p-0 navbar-dark nav-background");
    			add_location(nav, file$m, 11, 0, 203);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, nav, anchor);
    			append_dev(nav, div3);
    			append_dev(div3, a0);
    			append_dev(a0, div0);
    			append_dev(div0, img);
    			append_dev(a0, t0);
    			append_dev(a0, div1);
    			append_dev(div1, span0);
    			append_dev(div3, t2);
    			append_dev(div3, hr);
    			append_dev(div3, t3);
    			append_dev(div3, ul);
    			append_dev(ul, li0);
    			append_dev(li0, a1);
    			append_dev(a1, i0);
    			append_dev(a1, span1);
    			append_dev(ul, t5);
    			append_dev(ul, li1);
    			append_dev(li1, a2);
    			append_dev(a2, i1);
    			append_dev(a2, span2);
    			append_dev(ul, t7);
    			append_dev(ul, li2);
    			append_dev(li2, a3);
    			append_dev(a3, i2);
    			append_dev(a3, span3);
    			append_dev(ul, t9);
    			append_dev(ul, li3);
    			append_dev(li3, a4);
    			append_dev(a4, i3);
    			append_dev(a4, span4);
    			append_dev(ul, t11);
    			append_dev(ul, li4);
    			append_dev(li4, a5);
    			append_dev(a5, i4);
    			append_dev(a5, span5);
    			append_dev(ul, t13);
    			append_dev(ul, li5);
    			append_dev(li5, a6);
    			append_dev(a6, i5);
    			append_dev(i5, span6);
    			append_dev(ul, t15);
    			append_dev(ul, li6);
    			append_dev(li6, a7);
    			append_dev(a7, i6);
    			append_dev(a7, span7);
    			append_dev(ul, t17);
    			append_dev(ul, li7);
    			append_dev(div3, t18);
    			append_dev(div3, div2);
    			append_dev(div2, button);
    			append_dev(nav, t19);
    			append_dev(nav, script);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(nav);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$m.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$m($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('DashboardNavigator', slots, []);
    	let { active } = $$props;

    	function activeNav(value) {
    		if (value === active) {
    			return "active";
    		} else {
    			return "";
    		}
    	}

    	$$self.$$.on_mount.push(function () {
    		if (active === undefined && !('active' in $$props || $$self.$$.bound[$$self.$$.props['active']])) {
    			console.warn("<DashboardNavigator> was created without expected prop 'active'");
    		}
    	});

    	const writable_props = ['active'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<DashboardNavigator> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('active' in $$props) $$invalidate(1, active = $$props.active);
    	};

    	$$self.$capture_state = () => ({ active, activeNav });

    	$$self.$inject_state = $$props => {
    		if ('active' in $$props) $$invalidate(1, active = $$props.active);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [activeNav, active];
    }

    class DashboardNavigator extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$m, create_fragment$m, safe_not_equal, { active: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "DashboardNavigator",
    			options,
    			id: create_fragment$m.name
    		});
    	}

    	get active() {
    		throw new Error("<DashboardNavigator>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set active(value) {
    		throw new Error("<DashboardNavigator>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\components\DashboardHeader.svelte generated by Svelte v3.59.2 */
    const file$l = "src\\components\\DashboardHeader.svelte";

    function create_fragment$l(ctx) {
    	let div9;
    	let nav;
    	let div7;
    	let button;
    	let i0;
    	let t0;
    	let ul;
    	let li0;
    	let div1;
    	let a0;
    	let i1;
    	let t1;
    	let div0;
    	let h6;
    	let t3;
    	let a1;
    	let t5;
    	let li1;
    	let div2;
    	let t6;
    	let div3;
    	let t7;
    	let li2;
    	let div6;
    	let a2;
    	let span;
    	let t8_value = `${/*$basicDetails*/ ctx[0].firstname} ${/*$basicDetails*/ ctx[0].lastname}` + "";
    	let t8;
    	let t9;
    	let img;
    	let img_src_value;
    	let t10;
    	let div5;
    	let a3;
    	let i2;
    	let t11;
    	let t12;
    	let a4;
    	let i3;
    	let t13;
    	let t14;
    	let div4;
    	let t15;
    	let a5;
    	let i4;
    	let t16;
    	let t17;
    	let div8;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			div9 = element("div");
    			nav = element("nav");
    			div7 = element("div");
    			button = element("button");
    			i0 = element("i");
    			t0 = space();
    			ul = element("ul");
    			li0 = element("li");
    			div1 = element("div");
    			a0 = element("a");
    			i1 = element("i");
    			t1 = space();
    			div0 = element("div");
    			h6 = element("h6");
    			h6.textContent = "Notifications";
    			t3 = space();
    			a1 = element("a");
    			a1.textContent = "Show All Alerts";
    			t5 = space();
    			li1 = element("li");
    			div2 = element("div");
    			t6 = space();
    			div3 = element("div");
    			t7 = space();
    			li2 = element("li");
    			div6 = element("div");
    			a2 = element("a");
    			span = element("span");
    			t8 = text(t8_value);
    			t9 = space();
    			img = element("img");
    			t10 = space();
    			div5 = element("div");
    			a3 = element("a");
    			i2 = element("i");
    			t11 = text(" Profile");
    			t12 = space();
    			a4 = element("a");
    			i3 = element("i");
    			t13 = text(" Refer");
    			t14 = space();
    			div4 = element("div");
    			t15 = space();
    			a5 = element("a");
    			i4 = element("i");
    			t16 = text(" Logout");
    			t17 = space();
    			div8 = element("div");
    			attr_dev(i0, "class", "fas fa-bars");
    			add_location(i0, file$l, 6, 132, 316);
    			attr_dev(button, "class", "btn btn-link d-md-none rounded-circle me-3");
    			attr_dev(button, "id", "sidebarToggleTop");
    			attr_dev(button, "type", "button");
    			add_location(button, file$l, 6, 37, 221);
    			attr_dev(i1, "class", "fas fa-bell fa-fw");
    			add_location(i1, file$l, 23, 153, 1808);
    			attr_dev(a0, "class", "dropdown-toggle nav-link");
    			attr_dev(a0, "aria-expanded", "false");
    			attr_dev(a0, "data-bs-toggle", "dropdown");
    			attr_dev(a0, "href", "#");
    			add_location(a0, file$l, 23, 60, 1715);
    			attr_dev(h6, "class", "dropdown-header");
    			add_location(h6, file$l, 25, 28, 1978);
    			attr_dev(a1, "class", "dropdown-item text-center small text-gray-500");
    			attr_dev(a1, "href", "");
    			add_location(a1, file$l, 34, 28, 2624);
    			attr_dev(div0, "class", "dropdown-menu dropdown-menu-end dropdown-list animated--grow-in");
    			add_location(div0, file$l, 24, 24, 1871);
    			attr_dev(div1, "class", "nav-item dropdown no-arrow");
    			add_location(div1, file$l, 23, 20, 1675);
    			attr_dev(li0, "class", "nav-item dropdown no-arrow mx-1");
    			add_location(li0, file$l, 22, 16, 1609);
    			attr_dev(div2, "class", "shadow dropdown-list dropdown-menu dropdown-menu-end");
    			attr_dev(div2, "aria-labelledby", "alertsDropdown");
    			add_location(div2, file$l, 39, 20, 2875);
    			attr_dev(li1, "class", "nav-item dropdown no-arrow mx-1");
    			add_location(li1, file$l, 38, 16, 2809);
    			attr_dev(div3, "class", "d-none d-sm-block topbar-divider");
    			add_location(div3, file$l, 42, 16, 3046);
    			attr_dev(span, "class", "d-none d-lg-inline me-2 small text-white text-capitalize");
    			add_location(span, file$l, 46, 28, 3365);
    			attr_dev(img, "class", "border rounded-circle img-profile");
    			if (!src_url_equal(img.src, img_src_value = /*$basicDetails*/ ctx[0].picture)) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "");
    			add_location(img, file$l, 47, 28, 3529);
    			attr_dev(a2, "class", "dropdown-toggle nav-link");
    			attr_dev(a2, "aria-expanded", "false");
    			attr_dev(a2, "data-bs-toggle", "dropdown");
    			attr_dev(a2, "href", "");
    			add_location(a2, file$l, 45, 24, 3243);
    			attr_dev(i2, "class", "fas fa-user fa-sm fa-fw me-2 text-gray-400");
    			add_location(i2, file$l, 50, 69, 3809);
    			attr_dev(a3, "class", "dropdown-item");
    			attr_dev(a3, "href", "/profile");
    			add_location(a3, file$l, 50, 28, 3768);
    			attr_dev(i3, "class", "fas fa-cogs fa-sm fa-fw me-2 text-gray-400");
    			add_location(i3, file$l, 51, 132, 4018);
    			attr_dev(a4, "class", "dropdown-item");
    			attr_dev(a4, "href", "");
    			add_location(a4, file$l, 51, 28, 3914);
    			attr_dev(div4, "class", "dropdown-divider");
    			add_location(div4, file$l, 52, 28, 4121);
    			attr_dev(i4, "class", "fas fa-sign-out-alt fa-sm fa-fw me-2 text-gray-400");
    			add_location(i4, file$l, 53, 165, 4324);
    			attr_dev(a5, "class", "dropdown-item");
    			attr_dev(a5, "href", "/logout");
    			add_location(a5, file$l, 53, 28, 4187);
    			attr_dev(div5, "class", "dropdown-menu shadow dropdown-menu-end animated--grow-in");
    			add_location(div5, file$l, 49, 24, 3668);
    			attr_dev(div6, "class", "nav-item dropdown no-arrow");
    			add_location(div6, file$l, 44, 20, 3177);
    			attr_dev(li2, "class", "nav-item dropdown no-arrow");
    			add_location(li2, file$l, 43, 16, 3116);
    			attr_dev(ul, "class", "navbar-nav flex-nowrap ms-auto");
    			add_location(ul, file$l, 12, 12, 770);
    			attr_dev(div7, "class", "container-fluid");
    			add_location(div7, file$l, 6, 8, 192);
    			attr_dev(nav, "class", "navbar navbar-expand shadow mb-4 topbar background-color");
    			add_location(nav, file$l, 5, 4, 112);
    			attr_dev(div8, "class", "sharethis-inline-share-buttons");
    			add_location(div8, file$l, 61, 4, 4544);
    			add_location(div9, file$l, 4, 0, 101);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div9, anchor);
    			append_dev(div9, nav);
    			append_dev(nav, div7);
    			append_dev(div7, button);
    			append_dev(button, i0);
    			append_dev(div7, t0);
    			append_dev(div7, ul);
    			append_dev(ul, li0);
    			append_dev(li0, div1);
    			append_dev(div1, a0);
    			append_dev(a0, i1);
    			append_dev(div1, t1);
    			append_dev(div1, div0);
    			append_dev(div0, h6);
    			append_dev(div0, t3);
    			append_dev(div0, a1);
    			append_dev(ul, t5);
    			append_dev(ul, li1);
    			append_dev(li1, div2);
    			append_dev(ul, t6);
    			append_dev(ul, div3);
    			append_dev(ul, t7);
    			append_dev(ul, li2);
    			append_dev(li2, div6);
    			append_dev(div6, a2);
    			append_dev(a2, span);
    			append_dev(span, t8);
    			append_dev(a2, t9);
    			append_dev(a2, img);
    			append_dev(div6, t10);
    			append_dev(div6, div5);
    			append_dev(div5, a3);
    			append_dev(a3, i2);
    			append_dev(a3, t11);
    			append_dev(div5, t12);
    			append_dev(div5, a4);
    			append_dev(a4, i3);
    			append_dev(a4, t13);
    			append_dev(div5, t14);
    			append_dev(div5, div4);
    			append_dev(div5, t15);
    			append_dev(div5, a5);
    			append_dev(a5, i4);
    			append_dev(a5, t16);
    			append_dev(div9, t17);
    			append_dev(div9, div8);

    			if (!mounted) {
    				dispose = [
    					listen_dev(a4, "click", prevent_default(/*click_handler*/ ctx[1]), false, true, false, false),
    					listen_dev(a5, "click", /*click_handler_1*/ ctx[2], false, false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*$basicDetails*/ 1 && t8_value !== (t8_value = `${/*$basicDetails*/ ctx[0].firstname} ${/*$basicDetails*/ ctx[0].lastname}` + "")) set_data_dev(t8, t8_value);

    			if (dirty & /*$basicDetails*/ 1 && !src_url_equal(img.src, img_src_value = /*$basicDetails*/ ctx[0].picture)) {
    				attr_dev(img, "src", img_src_value);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div9);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$l.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$l($$self, $$props, $$invalidate) {
    	let $basicDetails;
    	validate_store(basicDetails, 'basicDetails');
    	component_subscribe($$self, basicDetails, $$value => $$invalidate(0, $basicDetails = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('DashboardHeader', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<DashboardHeader> was created with unknown prop '${key}'`);
    	});

    	const click_handler = () => {
    		referralLink($basicDetails.ref_code);
    	};

    	const click_handler_1 = () => {
    		$basicDetails.set({
    			firstname: "...",
    			lastname: "...",
    			picture: "",
    			date: ""
    		});
    	};

    	$$self.$capture_state = () => ({
    		basicDetails,
    		referralLink,
    		$basicDetails
    	});

    	return [$basicDetails, click_handler, click_handler_1];
    }

    class DashboardHeader extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$l, create_fragment$l, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "DashboardHeader",
    			options,
    			id: create_fragment$l.name
    		});
    	}
    }

    /* src\components\LoadingError.svelte generated by Svelte v3.59.2 */

    const file$k = "src\\components\\LoadingError.svelte";

    function create_fragment$k(ctx) {
    	let div4;
    	let div3;
    	let svg;
    	let g;
    	let circle;
    	let path;
    	let t0;
    	let div0;
    	let t2;
    	let div1;
    	let t3;
    	let t4;
    	let div2;
    	let button;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			div4 = element("div");
    			div3 = element("div");
    			svg = svg_element("svg");
    			g = svg_element("g");
    			circle = svg_element("circle");
    			path = svg_element("path");
    			t0 = space();
    			div0 = element("div");
    			div0.textContent = "Connection Error";
    			t2 = space();
    			div1 = element("div");
    			t3 = text(/*message*/ ctx[0]);
    			t4 = space();
    			div2 = element("div");
    			button = element("button");
    			button.textContent = "Retry";
    			attr_dev(circle, "cx", "32");
    			attr_dev(circle, "cy", "32");
    			attr_dev(circle, "r", "30");
    			attr_dev(circle, "stroke", "#FF6F61");
    			attr_dev(circle, "stroke-width", "2");
    			attr_dev(circle, "fill", "none");
    			add_location(circle, file$k, 8, 12, 223);
    			attr_dev(path, "d", "M32 8a24 24 0 1 0 0 48 24 24 0 0 0 0-48zm0 4a20 20 0 1 1 0 40 20 20 0 0 1 0-40zm0 12c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2s-2-.9-2-2V26c0-1.1.9-2 2-2zm0 20c1.1 0 2 1 2 2.25S33.1 48.5 32 48.5s-2-1-2-2.25S30.9 44 32 44z");
    			add_location(path, file$k, 9, 12, 315);
    			attr_dev(g, "fill", "#FF6F61");
    			add_location(g, file$k, 7, 10, 191);
    			attr_dev(svg, "class", "pulse svelte-tet7g1");
    			attr_dev(svg, "viewBox", "0 0 64 64");
    			attr_dev(svg, "xmlns", "http://www.w3.org/2000/svg");
    			add_location(svg, file$k, 6, 8, 105);
    			attr_dev(div0, "class", "message svelte-tet7g1");
    			add_location(div0, file$k, 12, 8, 581);
    			add_location(div1, file$k, 13, 8, 634);
    			attr_dev(button, "class", "text-button");
    			add_location(button, file$k, 15, 12, 696);
    			attr_dev(div2, "class", "my-2");
    			add_location(div2, file$k, 14, 8, 664);
    			attr_dev(div3, "class", "container svelte-tet7g1");
    			add_location(div3, file$k, 5, 4, 72);
    			attr_dev(div4, "class", "body svelte-tet7g1");
    			add_location(div4, file$k, 4, 0, 48);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div4, anchor);
    			append_dev(div4, div3);
    			append_dev(div3, svg);
    			append_dev(svg, g);
    			append_dev(g, circle);
    			append_dev(g, path);
    			append_dev(div3, t0);
    			append_dev(div3, div0);
    			append_dev(div3, t2);
    			append_dev(div3, div1);
    			append_dev(div1, t3);
    			append_dev(div3, t4);
    			append_dev(div3, div2);
    			append_dev(div2, button);

    			if (!mounted) {
    				dispose = listen_dev(button, "click", /*click_handler*/ ctx[1], false, false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*message*/ 1) set_data_dev(t3, /*message*/ ctx[0]);
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div4);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$k.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$k($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('LoadingError', slots, []);
    	let { message } = $$props;

    	$$self.$$.on_mount.push(function () {
    		if (message === undefined && !('message' in $$props || $$self.$$.bound[$$self.$$.props['message']])) {
    			console.warn("<LoadingError> was created without expected prop 'message'");
    		}
    	});

    	const writable_props = ['message'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<LoadingError> was created with unknown prop '${key}'`);
    	});

    	function click_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	$$self.$$set = $$props => {
    		if ('message' in $$props) $$invalidate(0, message = $$props.message);
    	};

    	$$self.$capture_state = () => ({ message });

    	$$self.$inject_state = $$props => {
    		if ('message' in $$props) $$invalidate(0, message = $$props.message);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [message, click_handler];
    }

    class LoadingError extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$k, create_fragment$k, safe_not_equal, { message: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "LoadingError",
    			options,
    			id: create_fragment$k.name
    		});
    	}

    	get message() {
    		throw new Error("<LoadingError>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set message(value) {
    		throw new Error("<LoadingError>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\components\Spinkit.svelte generated by Svelte v3.59.2 */

    const file$j = "src\\components\\Spinkit.svelte";

    function create_fragment$j(ctx) {
    	let div10;
    	let div9;
    	let div0;
    	let t0;
    	let div1;
    	let t1;
    	let div2;
    	let t2;
    	let div3;
    	let t3;
    	let div4;
    	let t4;
    	let div5;
    	let t5;
    	let div6;
    	let t6;
    	let div7;
    	let t7;
    	let div8;

    	const block = {
    		c: function create() {
    			div10 = element("div");
    			div9 = element("div");
    			div0 = element("div");
    			t0 = space();
    			div1 = element("div");
    			t1 = space();
    			div2 = element("div");
    			t2 = space();
    			div3 = element("div");
    			t3 = space();
    			div4 = element("div");
    			t4 = space();
    			div5 = element("div");
    			t5 = space();
    			div6 = element("div");
    			t6 = space();
    			div7 = element("div");
    			t7 = space();
    			div8 = element("div");
    			attr_dev(div0, "class", "sk-cube sk-cube1 svelte-1865ll8");
    			add_location(div0, file$j, 2, 8, 110);
    			attr_dev(div1, "class", "sk-cube sk-cube2 svelte-1865ll8");
    			add_location(div1, file$j, 3, 8, 156);
    			attr_dev(div2, "class", "sk-cube sk-cube3 svelte-1865ll8");
    			add_location(div2, file$j, 4, 8, 202);
    			attr_dev(div3, "class", "sk-cube sk-cube4 svelte-1865ll8");
    			add_location(div3, file$j, 5, 8, 248);
    			attr_dev(div4, "class", "sk-cube sk-cube5 svelte-1865ll8");
    			add_location(div4, file$j, 6, 8, 294);
    			attr_dev(div5, "class", "sk-cube sk-cube6 svelte-1865ll8");
    			add_location(div5, file$j, 7, 8, 340);
    			attr_dev(div6, "class", "sk-cube sk-cube7 svelte-1865ll8");
    			add_location(div6, file$j, 8, 8, 386);
    			attr_dev(div7, "class", "sk-cube sk-cube8 svelte-1865ll8");
    			add_location(div7, file$j, 9, 8, 432);
    			attr_dev(div8, "class", "sk-cube sk-cube9 svelte-1865ll8");
    			add_location(div8, file$j, 10, 8, 478);
    			attr_dev(div9, "class", "sk-cube-grid svelte-1865ll8");
    			add_location(div9, file$j, 1, 4, 74);
    			attr_dev(div10, "class", "w-100 d-flex justify-content-center align-items-center");
    			add_location(div10, file$j, 0, 0, 0);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div10, anchor);
    			append_dev(div10, div9);
    			append_dev(div9, div0);
    			append_dev(div9, t0);
    			append_dev(div9, div1);
    			append_dev(div9, t1);
    			append_dev(div9, div2);
    			append_dev(div9, t2);
    			append_dev(div9, div3);
    			append_dev(div9, t3);
    			append_dev(div9, div4);
    			append_dev(div9, t4);
    			append_dev(div9, div5);
    			append_dev(div9, t5);
    			append_dev(div9, div6);
    			append_dev(div9, t6);
    			append_dev(div9, div7);
    			append_dev(div9, t7);
    			append_dev(div9, div8);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div10);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$j.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$j($$self, $$props) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Spinkit', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Spinkit> was created with unknown prop '${key}'`);
    	});

    	return [];
    }

    class Spinkit extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$j, create_fragment$j, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Spinkit",
    			options,
    			id: create_fragment$j.name
    		});
    	}
    }

    function fade(node, { delay = 0, duration = 400, easing = identity } = {}) {
        const o = +getComputedStyle(node).opacity;
        return {
            delay,
            duration,
            easing,
            css: t => `opacity: ${t * o}`
        };
    }

    /* src\components\Modal.svelte generated by Svelte v3.59.2 */
    const file$i = "src\\components\\Modal.svelte";

    function create_fragment$i(ctx) {
    	let div1;
    	let div0;
    	let span;
    	let t1;
    	let div0_transition;
    	let current;
    	let mounted;
    	let dispose;
    	const default_slot_template = /*#slots*/ ctx[2].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[1], null);

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			div0 = element("div");
    			span = element("span");
    			span.textContent = "×";
    			t1 = space();
    			if (default_slot) default_slot.c();
    			attr_dev(span, "class", "close svelte-l2l4c6");
    			add_location(span, file$i, 10, 6, 272);
    			attr_dev(div0, "class", "modal-content svelte-l2l4c6");
    			add_location(div0, file$i, 9, 4, 221);
    			attr_dev(div1, "class", "modal svelte-l2l4c6");
    			toggle_class(div1, "show-modal", /*showModal*/ ctx[0]);
    			toggle_class(div1, "hide-modal", !/*showModal*/ ctx[0]);
    			add_location(div1, file$i, 6, 0, 107);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, div0);
    			append_dev(div0, span);
    			append_dev(div0, t1);

    			if (default_slot) {
    				default_slot.m(div0, null);
    			}

    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(span, "click", self$1(/*click_handler*/ ctx[4]), false, false, false, false),
    					listen_dev(span, "keyup", self$1(/*keyup_handler*/ ctx[3]), false, false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 2)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[1],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[1])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[1], dirty, null),
    						null
    					);
    				}
    			}

    			if (!current || dirty & /*showModal*/ 1) {
    				toggle_class(div1, "show-modal", /*showModal*/ ctx[0]);
    			}

    			if (!current || dirty & /*showModal*/ 1) {
    				toggle_class(div1, "hide-modal", !/*showModal*/ ctx[0]);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);

    			add_render_callback(() => {
    				if (!current) return;
    				if (!div0_transition) div0_transition = create_bidirectional_transition(div0, fade, {}, true);
    				div0_transition.run(1);
    			});

    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			if (!div0_transition) div0_transition = create_bidirectional_transition(div0, fade, {}, false);
    			div0_transition.run(0);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    			if (default_slot) default_slot.d(detaching);
    			if (detaching && div0_transition) div0_transition.end();
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$i.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$i($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Modal', slots, ['default']);
    	let { showModal = false } = $$props;
    	const writable_props = ['showModal'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Modal> was created with unknown prop '${key}'`);
    	});

    	function keyup_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	const click_handler = () => {
    		$$invalidate(0, showModal = false);
    	};

    	$$self.$$set = $$props => {
    		if ('showModal' in $$props) $$invalidate(0, showModal = $$props.showModal);
    		if ('$$scope' in $$props) $$invalidate(1, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({ fade, showModal });

    	$$self.$inject_state = $$props => {
    		if ('showModal' in $$props) $$invalidate(0, showModal = $$props.showModal);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [showModal, $$scope, slots, keyup_handler, click_handler];
    }

    class Modal extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$i, create_fragment$i, safe_not_equal, { showModal: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Modal",
    			options,
    			id: create_fragment$i.name
    		});
    	}

    	get showModal() {
    		throw new Error("<Modal>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set showModal(value) {
    		throw new Error("<Modal>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\components\modal\plans.svelte generated by Svelte v3.59.2 */

    const file$h = "src\\components\\modal\\plans.svelte";

    function create_fragment$h(ctx) {
    	let div24;
    	let div0;
    	let span0;
    	let i0;
    	let t0;
    	let a0;
    	let t2;
    	let t3;
    	let div23;
    	let div7;
    	let div6;
    	let div2;
    	let h30;
    	let t5;
    	let p0;
    	let t7;
    	let div1;
    	let t8;
    	let div3;
    	let h40;
    	let t10;
    	let div4;
    	let p1;
    	let i1;
    	let t11;
    	let t12;
    	let p2;
    	let i2;
    	let t13;
    	let t14;
    	let p3;
    	let i3;
    	let t15;
    	let t16;
    	let p4;
    	let i4;
    	let t17;
    	let t18;
    	let div5;
    	let a1;
    	let t20;
    	let div15;
    	let div14;
    	let div8;
    	let img;
    	let img_src_value;
    	let t21;
    	let div10;
    	let span1;
    	let t23;
    	let h31;
    	let t25;
    	let p5;
    	let t27;
    	let div9;
    	let t28;
    	let div11;
    	let h41;
    	let t30;
    	let div12;
    	let p6;
    	let i5;
    	let t31;
    	let t32;
    	let p7;
    	let i6;
    	let t33;
    	let t34;
    	let p8;
    	let i7;
    	let t35;
    	let t36;
    	let p9;
    	let i8;
    	let t37;
    	let t38;
    	let div13;
    	let a2;
    	let t40;
    	let div22;
    	let div21;
    	let div17;
    	let h32;
    	let t42;
    	let p10;
    	let t44;
    	let div16;
    	let t45;
    	let div18;
    	let h42;
    	let t47;
    	let div19;
    	let p11;
    	let i9;
    	let t48;
    	let t49;
    	let p12;
    	let i10;
    	let t50;
    	let t51;
    	let p13;
    	let i11;
    	let t52;
    	let t53;
    	let p14;
    	let i12;
    	let t54;
    	let t55;
    	let div20;
    	let a3;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			div24 = element("div");
    			div0 = element("div");
    			span0 = element("span");
    			i0 = element("i");
    			t0 = text(" Unfortunately your balance is quite low! Please ");
    			a0 = element("a");
    			a0.textContent = "top up";
    			t2 = text(" before proceeding.");
    			t3 = space();
    			div23 = element("div");
    			div7 = element("div");
    			div6 = element("div");
    			div2 = element("div");
    			h30 = element("h3");
    			h30.textContent = "Starter Plan";
    			t5 = space();
    			p0 = element("p");
    			p0.textContent = "Our starter plan";
    			t7 = space();
    			div1 = element("div");
    			t8 = space();
    			div3 = element("div");
    			h40 = element("h4");
    			h40.textContent = "$5000";
    			t10 = space();
    			div4 = element("div");
    			p1 = element("p");
    			i1 = element("i");
    			t11 = text("Duration: 7days");
    			t12 = space();
    			p2 = element("p");
    			i2 = element("i");
    			t13 = text("Crypto and Forex only");
    			t14 = space();
    			p3 = element("p");
    			i3 = element("i");
    			t15 = text("No Hidden Fees");
    			t16 = space();
    			p4 = element("p");
    			i4 = element("i");
    			t17 = text("No Tools");
    			t18 = space();
    			div5 = element("div");
    			a1 = element("a");
    			a1.textContent = "Purchase";
    			t20 = space();
    			div15 = element("div");
    			div14 = element("div");
    			div8 = element("div");
    			img = element("img");
    			t21 = space();
    			div10 = element("div");
    			span1 = element("span");
    			span1.textContent = "Popular";
    			t23 = space();
    			h31 = element("h3");
    			h31.textContent = "Plus Plan";
    			t25 = space();
    			p5 = element("p");
    			p5.textContent = "Enhanced Features For Growing Needs";
    			t27 = space();
    			div9 = element("div");
    			t28 = space();
    			div11 = element("div");
    			h41 = element("h4");
    			h41.textContent = "$10,000";
    			t30 = space();
    			div12 = element("div");
    			p6 = element("p");
    			i5 = element("i");
    			t31 = text("Duration: 3 Month");
    			t32 = space();
    			p7 = element("p");
    			i6 = element("i");
    			t33 = text("Crypto, Commodities and Forex only");
    			t34 = space();
    			p8 = element("p");
    			i7 = element("i");
    			t35 = text("No Hidden Fees");
    			t36 = space();
    			p9 = element("p");
    			i8 = element("i");
    			t37 = text("5 Tools");
    			t38 = space();
    			div13 = element("div");
    			a2 = element("a");
    			a2.textContent = "Purchase";
    			t40 = space();
    			div22 = element("div");
    			div21 = element("div");
    			div17 = element("div");
    			h32 = element("h3");
    			h32.textContent = "Compound Plan";
    			t42 = space();
    			p10 = element("p");
    			p10.textContent = "Unlimited Possibilities";
    			t44 = space();
    			div16 = element("div");
    			t45 = space();
    			div18 = element("div");
    			h42 = element("h4");
    			h42.textContent = "$15,000";
    			t47 = space();
    			div19 = element("div");
    			p11 = element("p");
    			i9 = element("i");
    			t48 = text("Duration: 6 months");
    			t49 = space();
    			p12 = element("p");
    			i10 = element("i");
    			t50 = text("All listed assets");
    			t51 = space();
    			p13 = element("p");
    			i11 = element("i");
    			t52 = text("No Hidden Fees");
    			t53 = space();
    			p14 = element("p");
    			i12 = element("i");
    			t54 = text("Unlimited Tools");
    			t55 = space();
    			div20 = element("div");
    			a3 = element("a");
    			a3.textContent = "Purchase";
    			attr_dev(i0, "class", "fas fa-info-circle");
    			add_location(i0, file$h, 21, 14, 705);
    			attr_dev(a0, "href", "/deposit");
    			attr_dev(a0, "class", "svelte-1uqbhcq");
    			add_location(a0, file$h, 21, 97, 788);
    			add_location(span0, file$h, 21, 8, 699);
    			attr_dev(div0, "class", "info-container mb-2 svelte-1uqbhcq");
    			toggle_class(div0, "d-none", /*balance*/ ctx[0] >= 5000);
    			add_location(div0, file$h, 20, 4, 625);
    			attr_dev(h30, "class", "svelte-1uqbhcq");
    			add_location(h30, file$h, 28, 14, 1208);
    			attr_dev(p0, "class", "svelte-1uqbhcq");
    			add_location(p0, file$h, 29, 14, 1245);
    			attr_dev(div1, "class", "line svelte-1uqbhcq");
    			add_location(div1, file$h, 30, 14, 1284);
    			attr_dev(div2, "class", "title svelte-1uqbhcq");
    			add_location(div2, file$h, 27, 12, 1173);
    			attr_dev(h40, "class", "svelte-1uqbhcq");
    			add_location(h40, file$h, 33, 14, 1377);
    			attr_dev(div3, "class", "price svelte-1uqbhcq");
    			add_location(div3, file$h, 32, 12, 1342);
    			attr_dev(i1, "class", "lni lni-checkmark-circle svelte-1uqbhcq");
    			add_location(i1, file$h, 36, 17, 1469);
    			attr_dev(p1, "class", "svelte-1uqbhcq");
    			add_location(p1, file$h, 36, 14, 1466);
    			attr_dev(i2, "class", "lni lni-checkmark-circle svelte-1uqbhcq");
    			add_location(i2, file$h, 37, 17, 1547);
    			attr_dev(p2, "class", "svelte-1uqbhcq");
    			add_location(p2, file$h, 37, 14, 1544);
    			attr_dev(i3, "class", "lni lni-checkmark-circle svelte-1uqbhcq");
    			add_location(i3, file$h, 38, 17, 1631);
    			attr_dev(p3, "class", "svelte-1uqbhcq");
    			add_location(p3, file$h, 38, 14, 1628);
    			attr_dev(i4, "class", "lni lni-close svelte-1uqbhcq");
    			add_location(i4, file$h, 40, 17, 1784);
    			attr_dev(p4, "class", "svelte-1uqbhcq");
    			add_location(p4, file$h, 40, 14, 1781);
    			attr_dev(div4, "class", "description svelte-1uqbhcq");
    			add_location(div4, file$h, 35, 12, 1425);
    			attr_dev(a1, "class", "btn btn-success btn-2");
    			attr_dev(a1, "href", "");
    			toggle_class(a1, "disabled", /*balance*/ ctx[0] < 5000 || /*isPurchasePlan*/ ctx[1]);
    			add_location(a1, file$h, 42, 32, 1879);
    			attr_dev(div5, "class", "button");
    			add_location(div5, file$h, 42, 12, 1859);
    			attr_dev(div6, "class", "single_price_plan wow fadeInUp svelte-1uqbhcq");
    			attr_dev(div6, "data-wow-delay", "0.2s");
    			set_style(div6, "visibility", "visible");
    			set_style(div6, "animation-delay", "0.2s");
    			set_style(div6, "animation-name", "fadeInUp");
    			add_location(div6, file$h, 26, 10, 1015);
    			attr_dev(div7, "class", "col-12 col-sm-8 col-md-6 col-lg-4");
    			add_location(div7, file$h, 25, 8, 956);
    			if (!src_url_equal(img.src, img_src_value = "https://bootdey.com/img/popular-pricing.png")) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "");
    			attr_dev(img, "class", "svelte-1uqbhcq");
    			add_location(img, file$h, 49, 36, 2421);
    			attr_dev(div8, "class", "side-shape");
    			add_location(div8, file$h, 49, 12, 2397);
    			attr_dev(span1, "class", "svelte-1uqbhcq");
    			add_location(span1, file$h, 50, 31, 2522);
    			attr_dev(h31, "class", "svelte-1uqbhcq");
    			add_location(h31, file$h, 51, 14, 2558);
    			attr_dev(p5, "class", "svelte-1uqbhcq");
    			add_location(p5, file$h, 52, 14, 2592);
    			attr_dev(div9, "class", "line svelte-1uqbhcq");
    			add_location(div9, file$h, 53, 14, 2650);
    			attr_dev(div10, "class", "title svelte-1uqbhcq");
    			add_location(div10, file$h, 50, 12, 2503);
    			attr_dev(h41, "class", "svelte-1uqbhcq");
    			add_location(h41, file$h, 56, 14, 2743);
    			attr_dev(div11, "class", "price svelte-1uqbhcq");
    			add_location(div11, file$h, 55, 12, 2708);
    			attr_dev(i5, "class", "lni lni-checkmark-circle svelte-1uqbhcq");
    			add_location(i5, file$h, 59, 17, 2837);
    			attr_dev(p6, "class", "svelte-1uqbhcq");
    			add_location(p6, file$h, 59, 14, 2834);
    			attr_dev(i6, "class", "lni lni-checkmark-circle svelte-1uqbhcq");
    			add_location(i6, file$h, 60, 17, 2917);
    			attr_dev(p7, "class", "svelte-1uqbhcq");
    			add_location(p7, file$h, 60, 14, 2914);
    			attr_dev(i7, "class", "lni lni-checkmark-circle svelte-1uqbhcq");
    			add_location(i7, file$h, 61, 17, 3014);
    			attr_dev(p8, "class", "svelte-1uqbhcq");
    			add_location(p8, file$h, 61, 14, 3011);
    			attr_dev(i8, "class", "lni lni-close svelte-1uqbhcq");
    			add_location(i8, file$h, 62, 17, 3091);
    			attr_dev(p9, "class", "svelte-1uqbhcq");
    			add_location(p9, file$h, 62, 14, 3088);
    			attr_dev(div12, "class", "description svelte-1uqbhcq");
    			add_location(div12, file$h, 58, 12, 2793);
    			attr_dev(a2, "class", "btn btn-warning");
    			attr_dev(a2, "href", "");
    			toggle_class(a2, "disabled", /*balance*/ ctx[0] < 10000 || /*isPurchasePlan*/ ctx[1]);
    			add_location(a2, file$h, 64, 32, 3185);
    			attr_dev(div13, "class", "button");
    			add_location(div13, file$h, 64, 12, 3165);
    			attr_dev(div14, "class", "single_price_plan active wow fadeInUp svelte-1uqbhcq");
    			attr_dev(div14, "data-wow-delay", "0.2s");
    			set_style(div14, "visibility", "visible");
    			set_style(div14, "animation-delay", "0.2s");
    			set_style(div14, "animation-name", "fadeInUp");
    			add_location(div14, file$h, 47, 10, 2200);
    			attr_dev(div15, "class", "col-12 col-sm-8 col-md-6 col-lg-4");
    			add_location(div15, file$h, 46, 8, 2141);
    			attr_dev(h32, "class", "svelte-1uqbhcq");
    			add_location(h32, file$h, 71, 14, 3692);
    			attr_dev(p10, "class", "svelte-1uqbhcq");
    			add_location(p10, file$h, 72, 14, 3730);
    			attr_dev(div16, "class", "line svelte-1uqbhcq");
    			add_location(div16, file$h, 73, 14, 3776);
    			attr_dev(div17, "class", "title svelte-1uqbhcq");
    			add_location(div17, file$h, 70, 12, 3657);
    			attr_dev(h42, "class", "svelte-1uqbhcq");
    			add_location(h42, file$h, 76, 14, 3869);
    			attr_dev(div18, "class", "price svelte-1uqbhcq");
    			add_location(div18, file$h, 75, 12, 3834);
    			attr_dev(i9, "class", "lni lni-checkmark-circle svelte-1uqbhcq");
    			add_location(i9, file$h, 79, 17, 3963);
    			attr_dev(p11, "class", "svelte-1uqbhcq");
    			add_location(p11, file$h, 79, 14, 3960);
    			attr_dev(i10, "class", "lni lni-checkmark-circle svelte-1uqbhcq");
    			add_location(i10, file$h, 80, 17, 4044);
    			attr_dev(p12, "class", "svelte-1uqbhcq");
    			add_location(p12, file$h, 80, 14, 4041);
    			attr_dev(i11, "class", "lni lni-checkmark-circle svelte-1uqbhcq");
    			add_location(i11, file$h, 81, 17, 4124);
    			attr_dev(p13, "class", "svelte-1uqbhcq");
    			add_location(p13, file$h, 81, 14, 4121);
    			attr_dev(i12, "class", "lni lni-checkmark-circle svelte-1uqbhcq");
    			add_location(i12, file$h, 83, 17, 4293);
    			attr_dev(p14, "class", "svelte-1uqbhcq");
    			add_location(p14, file$h, 83, 14, 4290);
    			attr_dev(div19, "class", "description svelte-1uqbhcq");
    			add_location(div19, file$h, 78, 12, 3919);
    			attr_dev(a3, "class", "btn btn-info");
    			attr_dev(a3, "href", "");
    			toggle_class(a3, "disabled", /*balance*/ ctx[0] < 15000 || /*isPurchasePlan*/ ctx[1]);
    			add_location(a3, file$h, 85, 32, 4406);
    			attr_dev(div20, "class", "button");
    			add_location(div20, file$h, 85, 12, 4386);
    			attr_dev(div21, "class", "single_price_plan wow fadeInUp svelte-1uqbhcq");
    			attr_dev(div21, "data-wow-delay", "0.2s");
    			set_style(div21, "visibility", "visible");
    			set_style(div21, "animation-delay", "0.2s");
    			set_style(div21, "animation-name", "fadeInUp");
    			add_location(div21, file$h, 69, 10, 3499);
    			attr_dev(div22, "class", "col-12 col-sm-8 col-md-6 col-lg-4");
    			add_location(div22, file$h, 68, 8, 3440);
    			attr_dev(div23, "class", "row justify-content-center mx-3");
    			add_location(div23, file$h, 23, 4, 861);
    			attr_dev(div24, "class", "mt-3");
    			add_location(div24, file$h, 19, 0, 601);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div24, anchor);
    			append_dev(div24, div0);
    			append_dev(div0, span0);
    			append_dev(span0, i0);
    			append_dev(span0, t0);
    			append_dev(span0, a0);
    			append_dev(span0, t2);
    			append_dev(div24, t3);
    			append_dev(div24, div23);
    			append_dev(div23, div7);
    			append_dev(div7, div6);
    			append_dev(div6, div2);
    			append_dev(div2, h30);
    			append_dev(div2, t5);
    			append_dev(div2, p0);
    			append_dev(div2, t7);
    			append_dev(div2, div1);
    			append_dev(div6, t8);
    			append_dev(div6, div3);
    			append_dev(div3, h40);
    			append_dev(div6, t10);
    			append_dev(div6, div4);
    			append_dev(div4, p1);
    			append_dev(p1, i1);
    			append_dev(p1, t11);
    			append_dev(div4, t12);
    			append_dev(div4, p2);
    			append_dev(p2, i2);
    			append_dev(p2, t13);
    			append_dev(div4, t14);
    			append_dev(div4, p3);
    			append_dev(p3, i3);
    			append_dev(p3, t15);
    			append_dev(div4, t16);
    			append_dev(div4, p4);
    			append_dev(p4, i4);
    			append_dev(p4, t17);
    			append_dev(div6, t18);
    			append_dev(div6, div5);
    			append_dev(div5, a1);
    			append_dev(div23, t20);
    			append_dev(div23, div15);
    			append_dev(div15, div14);
    			append_dev(div14, div8);
    			append_dev(div8, img);
    			append_dev(div14, t21);
    			append_dev(div14, div10);
    			append_dev(div10, span1);
    			append_dev(div10, t23);
    			append_dev(div10, h31);
    			append_dev(div10, t25);
    			append_dev(div10, p5);
    			append_dev(div10, t27);
    			append_dev(div10, div9);
    			append_dev(div14, t28);
    			append_dev(div14, div11);
    			append_dev(div11, h41);
    			append_dev(div14, t30);
    			append_dev(div14, div12);
    			append_dev(div12, p6);
    			append_dev(p6, i5);
    			append_dev(p6, t31);
    			append_dev(div12, t32);
    			append_dev(div12, p7);
    			append_dev(p7, i6);
    			append_dev(p7, t33);
    			append_dev(div12, t34);
    			append_dev(div12, p8);
    			append_dev(p8, i7);
    			append_dev(p8, t35);
    			append_dev(div12, t36);
    			append_dev(div12, p9);
    			append_dev(p9, i8);
    			append_dev(p9, t37);
    			append_dev(div14, t38);
    			append_dev(div14, div13);
    			append_dev(div13, a2);
    			append_dev(div23, t40);
    			append_dev(div23, div22);
    			append_dev(div22, div21);
    			append_dev(div21, div17);
    			append_dev(div17, h32);
    			append_dev(div17, t42);
    			append_dev(div17, p10);
    			append_dev(div17, t44);
    			append_dev(div17, div16);
    			append_dev(div21, t45);
    			append_dev(div21, div18);
    			append_dev(div18, h42);
    			append_dev(div21, t47);
    			append_dev(div21, div19);
    			append_dev(div19, p11);
    			append_dev(p11, i9);
    			append_dev(p11, t48);
    			append_dev(div19, t49);
    			append_dev(div19, p12);
    			append_dev(p12, i10);
    			append_dev(p12, t50);
    			append_dev(div19, t51);
    			append_dev(div19, p13);
    			append_dev(p13, i11);
    			append_dev(p13, t52);
    			append_dev(div19, t53);
    			append_dev(div19, p14);
    			append_dev(p14, i12);
    			append_dev(p14, t54);
    			append_dev(div21, t55);
    			append_dev(div21, div20);
    			append_dev(div20, a3);

    			if (!mounted) {
    				dispose = [
    					listen_dev(a1, "click", prevent_default(/*click_handler*/ ctx[3]), false, true, false, false),
    					listen_dev(a2, "click", prevent_default(/*click_handler_1*/ ctx[4]), false, true, false, false),
    					listen_dev(a3, "click", prevent_default(/*click_handler_2*/ ctx[5]), false, true, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*balance*/ 1) {
    				toggle_class(div0, "d-none", /*balance*/ ctx[0] >= 5000);
    			}

    			if (dirty & /*balance, isPurchasePlan*/ 3) {
    				toggle_class(a1, "disabled", /*balance*/ ctx[0] < 5000 || /*isPurchasePlan*/ ctx[1]);
    			}

    			if (dirty & /*balance, isPurchasePlan*/ 3) {
    				toggle_class(a2, "disabled", /*balance*/ ctx[0] < 10000 || /*isPurchasePlan*/ ctx[1]);
    			}

    			if (dirty & /*balance, isPurchasePlan*/ 3) {
    				toggle_class(a3, "disabled", /*balance*/ ctx[0] < 15000 || /*isPurchasePlan*/ ctx[1]);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div24);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$h.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$h($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Plans', slots, []);
    	let { balance } = $$props;
    	let isPurchasePlan = false;

    	async function purchasePlan(title, amount) {
    		$$invalidate(1, isPurchasePlan = true);
    		let response = await fetchAndSendDataWithJson("/purchase-plan", { title, amount }, 'POST');
    		$$invalidate(1, isPurchasePlan = false);

    		if (response.status) {
    			alertUser("", response.message, "success");
    		} else {
    			alertUser("", response.message, "error");
    		}
    	}

    	$$self.$$.on_mount.push(function () {
    		if (balance === undefined && !('balance' in $$props || $$self.$$.bound[$$self.$$.props['balance']])) {
    			console.warn("<Plans> was created without expected prop 'balance'");
    		}
    	});

    	const writable_props = ['balance'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Plans> was created with unknown prop '${key}'`);
    	});

    	const click_handler = () => {
    		purchasePlan("starter plan", 5000);
    	};

    	const click_handler_1 = () => {
    		purchasePlan("plus plan", 10000);
    	};

    	const click_handler_2 = () => {
    		purchasePlan("compound plan", 15000);
    	};

    	$$self.$$set = $$props => {
    		if ('balance' in $$props) $$invalidate(0, balance = $$props.balance);
    	};

    	$$self.$capture_state = () => ({
    		basicDetails,
    		actualCurrency,
    		fetchAndSendDataWithJson,
    		alertUser,
    		balance,
    		isPurchasePlan,
    		purchasePlan
    	});

    	$$self.$inject_state = $$props => {
    		if ('balance' in $$props) $$invalidate(0, balance = $$props.balance);
    		if ('isPurchasePlan' in $$props) $$invalidate(1, isPurchasePlan = $$props.isPurchasePlan);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		balance,
    		isPurchasePlan,
    		purchasePlan,
    		click_handler,
    		click_handler_1,
    		click_handler_2
    	];
    }

    class Plans extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$h, create_fragment$h, safe_not_equal, { balance: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Plans",
    			options,
    			id: create_fragment$h.name
    		});
    	}

    	get balance() {
    		throw new Error("<Plans>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set balance(value) {
    		throw new Error("<Plans>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\pages\dashboard\Overview.svelte generated by Svelte v3.59.2 */

    const file$g = "src\\pages\\dashboard\\Overview.svelte";

    function get_each_context$4(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[8] = list[i];
    	return child_ctx;
    }

    // (417:8) {:else}
    function create_else_block_1$2(ctx) {
    	let spinkit;
    	let current;
    	spinkit = new Spinkit({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(spinkit.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(spinkit, target, anchor);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(spinkit.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(spinkit.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(spinkit, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block_1$2.name,
    		type: "else",
    		source: "(417:8) {:else}",
    		ctx
    	});

    	return block;
    }

    // (415:48) 
    function create_if_block_1$8(ctx) {
    	let loadingerror;
    	let current;

    	loadingerror = new LoadingError({
    			props: { message: /*errorMessage*/ ctx[2] },
    			$$inline: true
    		});

    	loadingerror.$on("click", /*fetchData*/ ctx[5]);

    	const block = {
    		c: function create() {
    			create_component(loadingerror.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(loadingerror, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const loadingerror_changes = {};
    			if (dirty & /*errorMessage*/ 4) loadingerror_changes.message = /*errorMessage*/ ctx[2];
    			loadingerror.$set(loadingerror_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(loadingerror.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(loadingerror.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(loadingerror, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$8.name,
    		type: "if",
    		source: "(415:48) ",
    		ctx
    	});

    	return block;
    }

    // (45:8) {#if state === NetworkStates.loaded}
    function create_if_block$9(ctx) {
    	let div58;
    	let div0;
    	let h3;
    	let t1;
    	let a0;
    	let i0;
    	let t2;
    	let t3;
    	let div33;
    	let div8;
    	let div7;
    	let div6;
    	let div5;
    	let div3;
    	let div1;
    	let span0;
    	let t5;
    	let div2;
    	let span1;
    	let t6_value = actualCurrency(/*$basicDetails*/ ctx[4].currency) + "";
    	let t6;
    	let t7_value = /*dashboardData*/ ctx[0].balance + "";
    	let t7;
    	let t8;
    	let div4;
    	let i1;
    	let t9;
    	let div16;
    	let div15;
    	let div14;
    	let div13;
    	let div11;
    	let div9;
    	let span2;
    	let t11;
    	let div10;
    	let span3;
    	let t12_value = actualCurrency(/*$basicDetails*/ ctx[4].currency) + "";
    	let t12;
    	let t13_value = /*dashboardData*/ ctx[0].earnings + "";
    	let t13;
    	let t14;
    	let div12;
    	let i2;
    	let t15;
    	let div24;
    	let div23;
    	let div22;
    	let div21;
    	let div19;
    	let div17;
    	let span4;
    	let t17;
    	let div18;
    	let span5;
    	let t18_value = actualCurrency(/*$basicDetails*/ ctx[4].currency) + "";
    	let t18;
    	let t19_value = /*dashboardData*/ ctx[0].referals + "";
    	let t19;
    	let t20;
    	let div20;
    	let i3;
    	let t21;
    	let div32;
    	let div31;
    	let div30;
    	let div29;
    	let div27;
    	let div25;
    	let span6;
    	let t23;
    	let div26;
    	let span7;
    	let t24_value = /*dashboardData*/ ctx[0].plans + "";
    	let t24;
    	let t25;
    	let div28;
    	let i4;
    	let t26;
    	let div45;
    	let div38;
    	let div37;
    	let div34;
    	let h60;
    	let t28;
    	let div36;
    	let div35;
    	let canvas0;
    	let t29;
    	let div44;
    	let div43;
    	let div39;
    	let h61;
    	let t31;
    	let div42;
    	let div40;
    	let canvas1;
    	let canvas1_data_bss_chart_value;
    	let t32;
    	let div41;
    	let span8;
    	let i5;
    	let t33;
    	let span9;
    	let i6;
    	let t34;
    	let span10;
    	let i7;
    	let t35;
    	let t36;
    	let div57;
    	let div51;
    	let div48;
    	let div47;
    	let div46;
    	let t37;
    	let script0;
    	let script0_src_value;
    	let t39;
    	let div50;
    	let div49;
    	let h62;
    	let a1;
    	let t42;
    	let ul;
    	let t43;
    	let div56;
    	let div55;
    	let div54;
    	let div53;
    	let div52;
    	let t44;
    	let script1;
    	let script1_src_value;
    	let t46;
    	let modal;
    	let updating_showModal;
    	let current;
    	let mounted;
    	let dispose;
    	let each_value = /*dashboardData*/ ctx[0].transactions;
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$4(get_each_context$4(ctx, each_value, i));
    	}

    	let each_1_else = null;

    	if (!each_value.length) {
    		each_1_else = create_else_block$9(ctx);
    	}

    	function modal_showModal_binding(value) {
    		/*modal_showModal_binding*/ ctx[7](value);
    	}

    	let modal_props = {
    		$$slots: { default: [create_default_slot] },
    		$$scope: { ctx }
    	};

    	if (/*showPurchasePlanModal*/ ctx[3] !== void 0) {
    		modal_props.showModal = /*showPurchasePlanModal*/ ctx[3];
    	}

    	modal = new Modal({ props: modal_props, $$inline: true });
    	binding_callbacks.push(() => bind(modal, 'showModal', modal_showModal_binding));

    	const block = {
    		c: function create() {
    			div58 = element("div");
    			div0 = element("div");
    			h3 = element("h3");
    			h3.textContent = "Overview";
    			t1 = space();
    			a0 = element("a");
    			i0 = element("i");
    			t2 = text(" Purchase Plan");
    			t3 = space();
    			div33 = element("div");
    			div8 = element("div");
    			div7 = element("div");
    			div6 = element("div");
    			div5 = element("div");
    			div3 = element("div");
    			div1 = element("div");
    			span0 = element("span");
    			span0.textContent = "Balance";
    			t5 = space();
    			div2 = element("div");
    			span1 = element("span");
    			t6 = text(t6_value);
    			t7 = text(t7_value);
    			t8 = space();
    			div4 = element("div");
    			i1 = element("i");
    			t9 = space();
    			div16 = element("div");
    			div15 = element("div");
    			div14 = element("div");
    			div13 = element("div");
    			div11 = element("div");
    			div9 = element("div");
    			span2 = element("span");
    			span2.textContent = "Earnings";
    			t11 = space();
    			div10 = element("div");
    			span3 = element("span");
    			t12 = text(t12_value);
    			t13 = text(t13_value);
    			t14 = space();
    			div12 = element("div");
    			i2 = element("i");
    			t15 = space();
    			div24 = element("div");
    			div23 = element("div");
    			div22 = element("div");
    			div21 = element("div");
    			div19 = element("div");
    			div17 = element("div");
    			span4 = element("span");
    			span4.textContent = "referal\r\n                            bonus";
    			t17 = space();
    			div18 = element("div");
    			span5 = element("span");
    			t18 = text(t18_value);
    			t19 = text(t19_value);
    			t20 = space();
    			div20 = element("div");
    			i3 = element("i");
    			t21 = space();
    			div32 = element("div");
    			div31 = element("div");
    			div30 = element("div");
    			div29 = element("div");
    			div27 = element("div");
    			div25 = element("div");
    			span6 = element("span");
    			span6.textContent = "Active Plans";
    			t23 = space();
    			div26 = element("div");
    			span7 = element("span");
    			t24 = text(t24_value);
    			t25 = space();
    			div28 = element("div");
    			i4 = element("i");
    			t26 = space();
    			div45 = element("div");
    			div38 = element("div");
    			div37 = element("div");
    			div34 = element("div");
    			h60 = element("h6");
    			h60.textContent = "Earnings Overview";
    			t28 = space();
    			div36 = element("div");
    			div35 = element("div");
    			canvas0 = element("canvas");
    			t29 = space();
    			div44 = element("div");
    			div43 = element("div");
    			div39 = element("div");
    			h61 = element("h6");
    			h61.textContent = "Earnings Sources";
    			t31 = space();
    			div42 = element("div");
    			div40 = element("div");
    			canvas1 = element("canvas");
    			t32 = space();
    			div41 = element("div");
    			span8 = element("span");
    			i5 = element("i");
    			t33 = text(" Referrals ");
    			span9 = element("span");
    			i6 = element("i");
    			t34 = text(" Gains");
    			span10 = element("span");
    			i7 = element("i");
    			t35 = text(" Bonuses");
    			t36 = space();
    			div57 = element("div");
    			div51 = element("div");
    			div48 = element("div");
    			div47 = element("div");
    			div46 = element("div");
    			t37 = space();
    			script0 = element("script");
    			script0.textContent = "{\r\n                          \"interval\": \"1m\",\r\n                            \"width\": \"100%\",\r\n                              \"isTransparent\": false,\r\n                                \"backgroundColor\": \"#151515\",\r\n                                  \"height\": \"100%\",\r\n                                    \"symbol\": \"BITSTAMP:BTCUSD\",\r\n                                      \"showIntervalTabs\": true,\r\n                                        \"displayMode\": \"single\",\r\n                                          \"locale\": \"en\",\r\n                                            \"colorTheme\": \"dark\"\r\n                        }";
    			t39 = space();
    			div50 = element("div");
    			div49 = element("div");
    			h62 = element("h6");
    			h62.textContent = "Most recent transactions";
    			a1 = element("a");
    			a1.textContent = "View all";
    			t42 = space();
    			ul = element("ul");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			if (each_1_else) {
    				each_1_else.c();
    			}

    			t43 = space();
    			div56 = element("div");
    			div55 = element("div");
    			div54 = element("div");
    			div53 = element("div");
    			div52 = element("div");
    			t44 = space();
    			script1 = element("script");
    			script1.textContent = "{\r\n                            \"colorTheme\": \"dark\",\r\n                              \"backgroundColor\": \"#151515\",\r\n                                \"dateRange\": \"12M\",\r\n                                  \"showChart\": false,\r\n                                    \"locale\": \"en\",\r\n                                      \"width\": \"100%\",\r\n                                        \"height\": \"100%\",\r\n                                          \"largeChartUrl\": \"\",\r\n                                            \"isTransparent\": false,\r\n                                              \"showSymbolLogo\": true,\r\n                                                \"showFloatingTooltip\": false,\r\n                                                  \"tabs\": [\r\n                                                      {\r\n                                                          \"title\": \"Crypto\",\r\n                                                          \"symbols\": [\r\n                                                              {\r\n                                                                  \"s\": \"CRYPTO:BTCUSD\",\r\n                                                                  \"d\": \"BITCOIN\"\r\n                                                              },\r\n                                                              {\r\n                                                                  \"s\": \"CRYPTO:ETHUSD\",\r\n                                                                  \"d\": \"ETHEREUM\"\r\n                                                              },\r\n                                                              {\r\n                                                                  \"s\": \"CRYPTOCAP:USDT\",\r\n                                                                  \"d\": \"USDT\"\r\n                                                              },\r\n                                                              {\r\n                                                                  \"s\": \"CRYPTO:BNBUSD\",\r\n                                                                  \"d\": \"BNB\"\r\n                                                              },\r\n                                                              {\r\n                                                                  \"s\": \"CRYPTO:SOLUSD\",\r\n                                                                  \"d\": \"SOLANA\"\r\n                                                              },\r\n                                                              {\r\n                                                                  \"s\": \"CRYPTO:XRPUSD\",\r\n                                                                  \"d\": \"RIPPLE\"\r\n                                                              },\r\n                                                              {\r\n                                                                  \"s\": \"CRYPTO:DOGEUSD\",\r\n                                                                  \"d\": \"DOGECOIN\"\r\n                                                              },\r\n                                                              {\r\n                                                                  \"s\": \"CRYPTO:LTCUSD\",\r\n                                                                  \"d\": \"LITECOIN\"\r\n                                                              },\r\n                                                              {\r\n                                                                  \"s\": \"CRYPTO:MATICUSD\",\r\n                                                                  \"d\": \"POLYGON\"\r\n                                                              },\r\n                                                              {\r\n                                                                  \"s\": \"BINANCE:TRXUSD.P\",\r\n                                                                  \"d\": \"TRON\"\r\n                                                              },\r\n                                                              {\r\n                                                                  \"s\": \"CRYPTO:DOTUSD\",\r\n                                                                  \"d\": \"POLKADOT\"\r\n                                                              }\r\n                                                          ]\r\n                                                      },\r\n                                                    {\r\n                                                      \"title\": \"Commodities\",\r\n                                                      \"symbols\": [\r\n                                                          {\r\n                                                              \"s\": \"COMEX:GC1!\",\r\n                                                              \"d\": \"Gold\"\r\n                                                          },\r\n                                                          {\r\n                                                              \"s\": \"NYMEX:CL1!\",\r\n                                                              \"d\": \"WTI Crude Oil\"\r\n                                                          },\r\n                                                          {\r\n                                                              \"s\": \"CBOT:ZC1!\",\r\n                                                              \"d\": \"Corn\"\r\n                                                          },\r\n                                                          {\r\n                                                              \"s\": \"COMEX:LED1!\",\r\n                                                              \"d\": \"LEAD\"\r\n                                                          },\r\n                                                          {\r\n                                                              \"s\": \"COMEX:ZNC1!\",\r\n                                                              \"d\": \"ZINC\"\r\n                                                          },\r\n                                                          {\r\n                                                              \"s\": \"ACTIVTRADES:GASOLU2024\",\r\n                                                              \"d\": \"GASOLINE\"\r\n                                                          },\r\n                                                          {\r\n                                                              \"s\": \"CBOT:ZW1!\",\r\n                                                              \"d\": \"WHEAT\"\r\n                                                          },\r\n                                                          {\r\n                                                              \"s\": \"COMEX:HG1!\",\r\n                                                              \"d\": \"COPPER\"\r\n                                                          },\r\n                                                          {\r\n                                                              \"s\": \"COMEX:SI1!\",\r\n                                                              \"d\": \"SILVER\"\r\n                                                          },\r\n                                                          {\r\n                                                              \"s\": \"CBOT:ZL1!\",\r\n                                                              \"d\": \"SOYBEANS\"\r\n                                                          },\r\n                                                          {\r\n                                                              \"s\": \"OSE:NK2251!\",\r\n                                                              \"d\": \"NIKKEI\"\r\n                                                          }\r\n                                                      ],\r\n                                                      \"originalTitle\": \"Futures\"\r\n                                                    },\r\n                                                    {\r\n                                                      \"title\": \"Forex\",\r\n                                                      \"symbols\": [\r\n                                                        {\r\n                                                          \"s\": \"FX:EURUSD\",\r\n                                                          \"d\": \"EUR to USD\"\r\n                                                        },\r\n                                                        {\r\n                                                          \"s\": \"FX:GBPUSD\",\r\n                                                          \"d\": \"GBP to USD\"\r\n                                                        },\r\n                                                        {\r\n                                                          \"s\": \"FX:USDJPY\",\r\n                                                          \"d\": \"USD to JPY\"\r\n                                                        },\r\n                                                        {\r\n                                                          \"s\": \"FX:USDCHF\",\r\n                                                          \"d\": \"USD to CHF\"\r\n                                                        },\r\n                                                        {\r\n                                                          \"s\": \"FX:AUDUSD\",\r\n                                                          \"d\": \"AUD to USD\"\r\n                                                        },\r\n                                                        {\r\n                                                          \"s\": \"FX:USDCAD\",\r\n                                                          \"d\": \"USD to CAD\"\r\n                                                        },\r\n                                                        {\r\n                                                          \"s\": \"FX:EURJPY\"\r\n                                                        },\r\n                                                        {\r\n                                                          \"s\": \"FX:EURCAD\"\r\n                                                        },\r\n                                                        {\r\n                                                          \"s\": \"FX:EURAUD\"\r\n                                                        },\r\n                                                        {\r\n                                                          \"s\": \"FOREXCOM:GBPCHF\"\r\n                                                        }\r\n                                                      ],\r\n                                                      \"originalTitle\": \"Forex\"\r\n                                                    },\r\n                                                    {\r\n                                                      \"title\": \"Stocks\",\r\n                                                      \"symbols\": [\r\n                                                        {\r\n                                                          \"s\": \"NASDAQ:TSLA\",\r\n                                                          \"d\": \"TESLA\"\r\n                                                        },\r\n                                                        {\r\n                                                          \"s\": \"NASDAQ:NVDA\",\r\n                                                          \"d\": \"NVIDIA\"\r\n                                                        },\r\n                                                        {\r\n                                                          \"s\": \"NASDAQ:AAPL\",\r\n                                                          \"d\": \"APPLE\"\r\n                                                        },\r\n                                                        {\r\n                                                          \"s\": \"NASDAQ:AMZN\",\r\n                                                          \"d\": \"AMAZON\"\r\n                                                        },\r\n                                                        {\r\n                                                          \"s\": \"NYSE:BABA\",\r\n                                                          \"d\": \"ALI BABA\"\r\n                                                        },\r\n                                                        {\r\n                                                          \"s\": \"NASDAQ:MSFT\"\r\n                                                        },\r\n                                                        {\r\n                                                          \"s\": \"NASDAQ:META\"\r\n                                                        },\r\n                                                        {\r\n                                                          \"s\": \"NASDAQ:COIN\"\r\n                                                        },\r\n                                                        {\r\n                                                          \"s\": \"NASDAQ:GOOGL\"\r\n                                                        },\r\n                                                        {\r\n                                                          \"s\": \"NASDAQ:NFLX\"\r\n                                                        },\r\n                                                        {\r\n                                                          \"s\": \"NYSE:MCD\",\r\n                                                          \"d\": \"MAC DONALDS\"\r\n                                                        },\r\n                                                        {\r\n                                                          \"s\": \"NYSE:KO\",\r\n                                                          \"d\": \"COCA COLA\"\r\n                                                        },\r\n                                                        {\r\n                                                          \"s\": \"NYSE:BAC\"\r\n                                                        }\r\n                                                      ]\r\n                                                    }\r\n                                                  ]\r\n                          }";
    			t46 = space();
    			create_component(modal.$$.fragment);
    			attr_dev(h3, "class", "mb-0");
    			set_style(h3, "color", "var(--semi-white)");
    			add_location(h3, file$g, 47, 14, 1737);
    			attr_dev(i0, "class", "fas fa-plus-square fa-sm text-white-50");
    			add_location(i0, file$g, 49, 16, 1989);
    			attr_dev(a0, "class", "btn btn-primary btn-sm d-sm-inline-block");
    			attr_dev(a0, "role", "button");
    			attr_dev(a0, "href", "");
    			add_location(a0, file$g, 48, 14, 1816);
    			attr_dev(div0, "class", "d-sm-flex justify-content-between align-items-center mb-4");
    			add_location(div0, file$g, 46, 12, 1650);
    			add_location(span0, file$g, 58, 101, 2518);
    			attr_dev(div1, "class", "text-uppercase fw-bold text-xs mb-1");
    			set_style(div1, "color", "var(--ghost)");
    			add_location(div1, file$g, 58, 24, 2441);
    			set_style(span1, "color", "var(--white)");
    			add_location(span1, file$g, 60, 63, 2635);
    			attr_dev(div2, "class", "text-dark fw-bold h5 mb-0");
    			add_location(div2, file$g, 60, 24, 2596);
    			attr_dev(div3, "class", "col me-2");
    			add_location(div3, file$g, 57, 22, 2393);
    			attr_dev(i1, "class", "fas fa-money-bill-wave fa-2x text-gray-300");
    			add_location(i1, file$g, 62, 44, 2820);
    			attr_dev(div4, "class", "col-auto");
    			add_location(div4, file$g, 62, 22, 2798);
    			attr_dev(div5, "class", "row g-0 align-items-center");
    			add_location(div5, file$g, 56, 20, 2329);
    			attr_dev(div6, "class", "card-body");
    			add_location(div6, file$g, 55, 18, 2284);
    			attr_dev(div7, "class", "card shadow border-left-primary py-2 card-color");
    			add_location(div7, file$g, 54, 16, 2203);
    			attr_dev(div8, "class", "col-md-6 col-xl-3 mb-4");
    			add_location(div8, file$g, 53, 14, 2149);
    			add_location(span2, file$g, 72, 101, 3366);
    			attr_dev(div9, "class", "text-uppercase fw-bold text-xs mb-1");
    			set_style(div9, "color", "var(--ghost)");
    			add_location(div9, file$g, 72, 24, 3289);
    			set_style(span3, "color", "var(--white)");
    			add_location(span3, file$g, 74, 63, 3484);
    			attr_dev(div10, "class", "text-dark fw-bold h5 mb-0");
    			add_location(div10, file$g, 74, 24, 3445);
    			attr_dev(div11, "class", "col me-2");
    			add_location(div11, file$g, 71, 22, 3241);
    			attr_dev(i2, "class", "fas fa-piggy-bank fa-2x text-gray-300");
    			add_location(i2, file$g, 76, 44, 3670);
    			attr_dev(div12, "class", "col-auto");
    			add_location(div12, file$g, 76, 22, 3648);
    			attr_dev(div13, "class", "row g-0 align-items-center");
    			add_location(div13, file$g, 70, 20, 3177);
    			attr_dev(div14, "class", "card-body");
    			add_location(div14, file$g, 69, 18, 3132);
    			attr_dev(div15, "class", "card shadow border-left-info py-2 card-color");
    			add_location(div15, file$g, 68, 16, 3054);
    			attr_dev(div16, "class", "col-md-6 col-xl-3 mb-4");
    			add_location(div16, file$g, 67, 14, 3000);
    			add_location(span4, file$g, 86, 101, 4214);
    			attr_dev(div17, "class", "text-uppercase fw-bold text-xs mb-1");
    			set_style(div17, "color", "var(--ghost)");
    			add_location(div17, file$g, 86, 24, 4137);
    			set_style(span5, "color", "var(--white)");
    			add_location(span5, file$g, 88, 63, 4340);
    			attr_dev(div18, "class", "text-dark fw-bold h5 mb-0");
    			add_location(div18, file$g, 88, 24, 4301);
    			attr_dev(div19, "class", "col me-2");
    			add_location(div19, file$g, 85, 22, 4089);
    			attr_dev(i3, "class", "fas fa-share fa-2x text-gray-300");
    			add_location(i3, file$g, 90, 44, 4526);
    			attr_dev(div20, "class", "col-auto");
    			add_location(div20, file$g, 90, 22, 4504);
    			attr_dev(div21, "class", "row g-0 align-items-center");
    			add_location(div21, file$g, 84, 20, 4025);
    			attr_dev(div22, "class", "card-body");
    			add_location(div22, file$g, 83, 18, 3980);
    			attr_dev(div23, "class", "card shadow border-left-warning py-2 card-color");
    			add_location(div23, file$g, 82, 16, 3899);
    			attr_dev(div24, "class", "col-md-6 col-xl-3 mb-4");
    			add_location(div24, file$g, 81, 14, 3845);
    			add_location(span6, file$g, 100, 101, 5075);
    			attr_dev(div25, "class", "text-uppercase fw-bold text-xs mb-1");
    			set_style(div25, "color", "var(--ghost)");
    			add_location(div25, file$g, 100, 24, 4998);
    			set_style(span7, "color", "var(--white)");
    			add_location(span7, file$g, 101, 63, 5171);
    			attr_dev(div26, "class", "text-dark fw-bold h5 mb-0");
    			add_location(div26, file$g, 101, 24, 5132);
    			attr_dev(div27, "class", "col me-2");
    			add_location(div27, file$g, 99, 22, 4950);
    			attr_dev(i4, "class", "fas fa-chart-pie fa-2x text-gray-300");
    			add_location(i4, file$g, 103, 44, 5314);
    			attr_dev(div28, "class", "col-auto");
    			add_location(div28, file$g, 103, 22, 5292);
    			attr_dev(div29, "class", "row g-0 align-items-center");
    			add_location(div29, file$g, 98, 20, 4886);
    			attr_dev(div30, "class", "card-body");
    			add_location(div30, file$g, 97, 18, 4841);
    			attr_dev(div31, "class", "card shadow border-left-danger py-2 card-color hover-plan");
    			add_location(div31, file$g, 96, 16, 4750);
    			attr_dev(div32, "class", "col-md-6 col-xl-3 mb-4");
    			add_location(div32, file$g, 95, 14, 4696);
    			attr_dev(div33, "class", "row");
    			add_location(div33, file$g, 52, 12, 2116);
    			attr_dev(h60, "class", "fw-bold m-0 text-white");
    			add_location(h60, file$g, 113, 20, 5757);
    			attr_dev(div34, "class", "card-header d-flex justify-content-between align-items-center card-color");
    			add_location(div34, file$g, 112, 18, 5649);
    			attr_dev(canvas0, "data-bss-chart", fetchLineChartData());
    			add_location(canvas0, file$g, 116, 44, 5929);
    			attr_dev(div35, "class", "chart-area");
    			add_location(div35, file$g, 116, 20, 5905);
    			attr_dev(div36, "class", "card-body");
    			add_location(div36, file$g, 115, 18, 5860);
    			attr_dev(div37, "class", "card shadow mb-4 card-color");
    			add_location(div37, file$g, 111, 16, 5588);
    			attr_dev(div38, "class", "col-lg-7 col-xl-8");
    			add_location(div38, file$g, 110, 14, 5539);
    			attr_dev(h61, "class", "text-primary fw-bold m-0");
    			add_location(h61, file$g, 124, 20, 6296);
    			attr_dev(div39, "class", "card-header d-flex justify-content-between align-items-center");
    			add_location(div39, file$g, 123, 18, 6199);
    			attr_dev(canvas1, "data-bss-chart", canvas1_data_bss_chart_value = fetchDoughnutChart(/*dashboardData*/ ctx[0].referals, /*dashboardData*/ ctx[0].earnings, /*dashboardData*/ ctx[0].bonus));
    			add_location(canvas1, file$g, 127, 44, 6469);
    			attr_dev(div40, "class", "chart-area");
    			add_location(div40, file$g, 127, 20, 6445);
    			attr_dev(i5, "class", "fas fa-circle text-primary");
    			add_location(i5, file$g, 129, 75, 6711);
    			attr_dev(span8, "class", "me-2");
    			add_location(span8, file$g, 129, 56, 6692);
    			attr_dev(i6, "class", "fas fa-circle text-success");
    			add_location(i6, file$g, 130, 112, 6827);
    			attr_dev(span9, "class", "me-2");
    			add_location(span9, file$g, 130, 93, 6808);
    			attr_dev(i7, "class", "fas fa-circle text-info");
    			add_location(i7, file$g, 131, 102, 6933);
    			attr_dev(span10, "class", "me-2");
    			add_location(span10, file$g, 131, 83, 6914);
    			attr_dev(div41, "class", "text-center small mt-4");
    			add_location(div41, file$g, 129, 20, 6656);
    			attr_dev(div42, "class", "card-body");
    			add_location(div42, file$g, 126, 18, 6400);
    			attr_dev(div43, "class", "card shadow mb-4");
    			add_location(div43, file$g, 122, 16, 6149);
    			attr_dev(div44, "class", "col-lg-5 col-xl-4");
    			add_location(div44, file$g, 121, 14, 6100);
    			attr_dev(div45, "class", "row");
    			add_location(div45, file$g, 109, 12, 5506);
    			attr_dev(div46, "class", "tradingview-widget-container__widget");
    			add_location(div46, file$g, 142, 20, 7402);
    			attr_dev(script0, "type", "text/javascript");
    			if (!src_url_equal(script0.src, script0_src_value = "https://s3.tradingview.com/external-embedding/embed-widget-technical-analysis.js")) attr_dev(script0, "src", script0_src_value);
    			script0.async = true;
    			add_location(script0, file$g, 143, 20, 7480);
    			attr_dev(div47, "class", "tradingview-widget-container h-100");
    			add_location(div47, file$g, 141, 18, 7332);
    			attr_dev(div48, "class", "my-2");
    			set_style(div48, "height", "350px");
    			add_location(div48, file$g, 139, 16, 7209);
    			attr_dev(h62, "class", "fw-bold m-0 text-dark");
    			add_location(h62, file$g, 163, 20, 8559);
    			attr_dev(a1, "class", "text-primary text-decoration-none");
    			attr_dev(a1, "href", "/transactions");
    			add_location(a1, file$g, 163, 83, 8622);
    			attr_dev(div49, "class", "card-header d-flex justify-content-between py-3");
    			add_location(div49, file$g, 162, 18, 8476);
    			attr_dev(ul, "class", "list-group list-group-flush");
    			add_location(ul, file$g, 166, 18, 8769);
    			attr_dev(div50, "class", "card shadow mb-4");
    			add_location(div50, file$g, 161, 16, 8426);
    			attr_dev(div51, "class", "col-lg-6 mb-4");
    			add_location(div51, file$g, 138, 14, 7164);
    			attr_dev(div52, "class", "tradingview-widget-container__widget");
    			add_location(div52, file$g, 193, 22, 10342);
    			attr_dev(script1, "type", "text/javascript");
    			if (!src_url_equal(script1.src, script1_src_value = "https://s3.tradingview.com/external-embedding/embed-widget-market-overview.js")) attr_dev(script1, "src", script1_src_value);
    			script1.async = true;
    			add_location(script1, file$g, 194, 22, 10422);
    			attr_dev(div53, "class", "tradingview-widget-container");
    			add_location(div53, file$g, 192, 20, 10276);
    			attr_dev(div54, "class", "mb-4");
    			add_location(div54, file$g, 190, 18, 10181);
    			attr_dev(div55, "class", "row h-100");
    			set_style(div55, "min-height", "410px");
    			add_location(div55, file$g, 189, 16, 10111);
    			attr_dev(div56, "class", "col");
    			add_location(div56, file$g, 188, 14, 10076);
    			attr_dev(div57, "class", "row");
    			add_location(div57, file$g, 137, 12, 7131);
    			attr_dev(div58, "class", "container-fluid");
    			add_location(div58, file$g, 45, 10, 1607);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div58, anchor);
    			append_dev(div58, div0);
    			append_dev(div0, h3);
    			append_dev(div0, t1);
    			append_dev(div0, a0);
    			append_dev(a0, i0);
    			append_dev(a0, t2);
    			append_dev(div58, t3);
    			append_dev(div58, div33);
    			append_dev(div33, div8);
    			append_dev(div8, div7);
    			append_dev(div7, div6);
    			append_dev(div6, div5);
    			append_dev(div5, div3);
    			append_dev(div3, div1);
    			append_dev(div1, span0);
    			append_dev(div3, t5);
    			append_dev(div3, div2);
    			append_dev(div2, span1);
    			append_dev(span1, t6);
    			append_dev(span1, t7);
    			append_dev(div5, t8);
    			append_dev(div5, div4);
    			append_dev(div4, i1);
    			append_dev(div33, t9);
    			append_dev(div33, div16);
    			append_dev(div16, div15);
    			append_dev(div15, div14);
    			append_dev(div14, div13);
    			append_dev(div13, div11);
    			append_dev(div11, div9);
    			append_dev(div9, span2);
    			append_dev(div11, t11);
    			append_dev(div11, div10);
    			append_dev(div10, span3);
    			append_dev(span3, t12);
    			append_dev(span3, t13);
    			append_dev(div13, t14);
    			append_dev(div13, div12);
    			append_dev(div12, i2);
    			append_dev(div33, t15);
    			append_dev(div33, div24);
    			append_dev(div24, div23);
    			append_dev(div23, div22);
    			append_dev(div22, div21);
    			append_dev(div21, div19);
    			append_dev(div19, div17);
    			append_dev(div17, span4);
    			append_dev(div19, t17);
    			append_dev(div19, div18);
    			append_dev(div18, span5);
    			append_dev(span5, t18);
    			append_dev(span5, t19);
    			append_dev(div21, t20);
    			append_dev(div21, div20);
    			append_dev(div20, i3);
    			append_dev(div33, t21);
    			append_dev(div33, div32);
    			append_dev(div32, div31);
    			append_dev(div31, div30);
    			append_dev(div30, div29);
    			append_dev(div29, div27);
    			append_dev(div27, div25);
    			append_dev(div25, span6);
    			append_dev(div27, t23);
    			append_dev(div27, div26);
    			append_dev(div26, span7);
    			append_dev(span7, t24);
    			append_dev(div29, t25);
    			append_dev(div29, div28);
    			append_dev(div28, i4);
    			append_dev(div58, t26);
    			append_dev(div58, div45);
    			append_dev(div45, div38);
    			append_dev(div38, div37);
    			append_dev(div37, div34);
    			append_dev(div34, h60);
    			append_dev(div37, t28);
    			append_dev(div37, div36);
    			append_dev(div36, div35);
    			append_dev(div35, canvas0);
    			append_dev(div45, t29);
    			append_dev(div45, div44);
    			append_dev(div44, div43);
    			append_dev(div43, div39);
    			append_dev(div39, h61);
    			append_dev(div43, t31);
    			append_dev(div43, div42);
    			append_dev(div42, div40);
    			append_dev(div40, canvas1);
    			append_dev(div42, t32);
    			append_dev(div42, div41);
    			append_dev(div41, span8);
    			append_dev(span8, i5);
    			append_dev(span8, t33);
    			append_dev(div41, span9);
    			append_dev(span9, i6);
    			append_dev(span9, t34);
    			append_dev(div41, span10);
    			append_dev(span10, i7);
    			append_dev(span10, t35);
    			append_dev(div58, t36);
    			append_dev(div58, div57);
    			append_dev(div57, div51);
    			append_dev(div51, div48);
    			append_dev(div48, div47);
    			append_dev(div47, div46);
    			append_dev(div47, t37);
    			append_dev(div47, script0);
    			append_dev(div51, t39);
    			append_dev(div51, div50);
    			append_dev(div50, div49);
    			append_dev(div49, h62);
    			append_dev(div49, a1);
    			append_dev(div50, t42);
    			append_dev(div50, ul);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				if (each_blocks[i]) {
    					each_blocks[i].m(ul, null);
    				}
    			}

    			if (each_1_else) {
    				each_1_else.m(ul, null);
    			}

    			append_dev(div57, t43);
    			append_dev(div57, div56);
    			append_dev(div56, div55);
    			append_dev(div55, div54);
    			append_dev(div54, div53);
    			append_dev(div53, div52);
    			append_dev(div53, t44);
    			append_dev(div53, script1);
    			insert_dev(target, t46, anchor);
    			mount_component(modal, target, anchor);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(a0, "click", prevent_default(/*click_handler*/ ctx[6]), false, true, false, false),
    					action_destroyer(loadCharts.call(null, canvas1))
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if ((!current || dirty & /*$basicDetails*/ 16) && t6_value !== (t6_value = actualCurrency(/*$basicDetails*/ ctx[4].currency) + "")) set_data_dev(t6, t6_value);
    			if ((!current || dirty & /*dashboardData*/ 1) && t7_value !== (t7_value = /*dashboardData*/ ctx[0].balance + "")) set_data_dev(t7, t7_value);
    			if ((!current || dirty & /*$basicDetails*/ 16) && t12_value !== (t12_value = actualCurrency(/*$basicDetails*/ ctx[4].currency) + "")) set_data_dev(t12, t12_value);
    			if ((!current || dirty & /*dashboardData*/ 1) && t13_value !== (t13_value = /*dashboardData*/ ctx[0].earnings + "")) set_data_dev(t13, t13_value);
    			if ((!current || dirty & /*$basicDetails*/ 16) && t18_value !== (t18_value = actualCurrency(/*$basicDetails*/ ctx[4].currency) + "")) set_data_dev(t18, t18_value);
    			if ((!current || dirty & /*dashboardData*/ 1) && t19_value !== (t19_value = /*dashboardData*/ ctx[0].referals + "")) set_data_dev(t19, t19_value);
    			if ((!current || dirty & /*dashboardData*/ 1) && t24_value !== (t24_value = /*dashboardData*/ ctx[0].plans + "")) set_data_dev(t24, t24_value);

    			if (!current || dirty & /*dashboardData*/ 1 && canvas1_data_bss_chart_value !== (canvas1_data_bss_chart_value = fetchDoughnutChart(/*dashboardData*/ ctx[0].referals, /*dashboardData*/ ctx[0].earnings, /*dashboardData*/ ctx[0].bonus))) {
    				attr_dev(canvas1, "data-bss-chart", canvas1_data_bss_chart_value);
    			}

    			if (dirty & /*dashboardData, formatUTCDateToYrMntDay*/ 1) {
    				each_value = /*dashboardData*/ ctx[0].transactions;
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$4(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$4(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(ul, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;

    				if (!each_value.length && each_1_else) {
    					each_1_else.p(ctx, dirty);
    				} else if (!each_value.length) {
    					each_1_else = create_else_block$9(ctx);
    					each_1_else.c();
    					each_1_else.m(ul, null);
    				} else if (each_1_else) {
    					each_1_else.d(1);
    					each_1_else = null;
    				}
    			}

    			const modal_changes = {};

    			if (dirty & /*$$scope, dashboardData*/ 2049) {
    				modal_changes.$$scope = { dirty, ctx };
    			}

    			if (!updating_showModal && dirty & /*showPurchasePlanModal*/ 8) {
    				updating_showModal = true;
    				modal_changes.showModal = /*showPurchasePlanModal*/ ctx[3];
    				add_flush_callback(() => updating_showModal = false);
    			}

    			modal.$set(modal_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(modal.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(modal.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div58);
    			destroy_each(each_blocks, detaching);
    			if (each_1_else) each_1_else.d();
    			if (detaching) detach_dev(t46);
    			destroy_component(modal, detaching);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$9.name,
    		type: "if",
    		source: "(45:8) {#if state === NetworkStates.loaded}",
    		ctx
    	});

    	return block;
    }

    // (177:20) {:else}
    function create_else_block$9(ctx) {
    	let li;
    	let div1;
    	let div0;
    	let h6;
    	let em;
    	let t1;

    	const block = {
    		c: function create() {
    			li = element("li");
    			div1 = element("div");
    			div0 = element("div");
    			h6 = element("h6");
    			em = element("em");
    			em.textContent = "No transactions yet";
    			t1 = space();
    			add_location(em, file$g, 180, 45, 9832);
    			attr_dev(h6, "class", "mb-0");
    			add_location(h6, file$g, 180, 28, 9815);
    			attr_dev(div0, "class", "col me-2");
    			set_style(div0, "text-align", "center");
    			add_location(div0, file$g, 179, 26, 9735);
    			attr_dev(div1, "class", "row g-0 align-items-center");
    			add_location(div1, file$g, 178, 24, 9667);
    			attr_dev(li, "class", "list-group-item");
    			add_location(li, file$g, 177, 22, 9613);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, li, anchor);
    			append_dev(li, div1);
    			append_dev(div1, div0);
    			append_dev(div0, h6);
    			append_dev(h6, em);
    			append_dev(li, t1);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(li);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$9.name,
    		type: "else",
    		source: "(177:20) {:else}",
    		ctx
    	});

    	return block;
    }

    // (168:20) {#each dashboardData.transactions as transaction}
    function create_each_block$4(ctx) {
    	let li;
    	let div2;
    	let div0;
    	let h6;
    	let strong;
    	let t0_value = /*transaction*/ ctx[8].description + "";
    	let t0;
    	let span0;
    	let t1_value = formatUTCDateToYrMntDay(/*transaction*/ ctx[8].date) + "";
    	let t1;
    	let t2;
    	let div1;
    	let span1;
    	let t3_value = /*transaction*/ ctx[8].status + "";
    	let t3;
    	let t4;

    	const block = {
    		c: function create() {
    			li = element("li");
    			div2 = element("div");
    			div0 = element("div");
    			h6 = element("h6");
    			strong = element("strong");
    			t0 = text(t0_value);
    			span0 = element("span");
    			t1 = text(t1_value);
    			t2 = space();
    			div1 = element("div");
    			span1 = element("span");
    			t3 = text(t3_value);
    			t4 = space();
    			add_location(strong, file$g, 171, 45, 9095);
    			attr_dev(h6, "class", "mb-0");
    			add_location(h6, file$g, 171, 28, 9078);
    			attr_dev(span0, "class", "text-xs");
    			add_location(span0, file$g, 171, 92, 9142);
    			attr_dev(div0, "class", "col me-2");
    			add_location(div0, file$g, 170, 26, 9026);
    			toggle_class(span1, "text-style-info", /*transaction*/ ctx[8].status === "pending");
    			toggle_class(span1, "text-error", /*transaction*/ ctx[8].status === "failed");
    			toggle_class(span1, "text-success", /*transaction*/ ctx[8].status === "success");
    			add_location(span1, file$g, 173, 48, 9298);
    			attr_dev(div1, "class", "col-auto");
    			add_location(div1, file$g, 173, 26, 9276);
    			attr_dev(div2, "class", "row g-0 align-items-center");
    			add_location(div2, file$g, 169, 24, 8958);
    			attr_dev(li, "class", "list-group-item");
    			add_location(li, file$g, 168, 22, 8904);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, li, anchor);
    			append_dev(li, div2);
    			append_dev(div2, div0);
    			append_dev(div0, h6);
    			append_dev(h6, strong);
    			append_dev(strong, t0);
    			append_dev(div0, span0);
    			append_dev(span0, t1);
    			append_dev(div2, t2);
    			append_dev(div2, div1);
    			append_dev(div1, span1);
    			append_dev(span1, t3);
    			append_dev(li, t4);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*dashboardData*/ 1 && t0_value !== (t0_value = /*transaction*/ ctx[8].description + "")) set_data_dev(t0, t0_value);
    			if (dirty & /*dashboardData*/ 1 && t1_value !== (t1_value = formatUTCDateToYrMntDay(/*transaction*/ ctx[8].date) + "")) set_data_dev(t1, t1_value);
    			if (dirty & /*dashboardData*/ 1 && t3_value !== (t3_value = /*transaction*/ ctx[8].status + "")) set_data_dev(t3, t3_value);

    			if (dirty & /*dashboardData*/ 1) {
    				toggle_class(span1, "text-style-info", /*transaction*/ ctx[8].status === "pending");
    			}

    			if (dirty & /*dashboardData*/ 1) {
    				toggle_class(span1, "text-error", /*transaction*/ ctx[8].status === "failed");
    			}

    			if (dirty & /*dashboardData*/ 1) {
    				toggle_class(span1, "text-success", /*transaction*/ ctx[8].status === "success");
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(li);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$4.name,
    		type: "each",
    		source: "(168:20) {#each dashboardData.transactions as transaction}",
    		ctx
    	});

    	return block;
    }

    // (412:10) <Modal bind:showModal={showPurchasePlanModal}>
    function create_default_slot(ctx) {
    	let plans;
    	let current;

    	plans = new Plans({
    			props: {
    				balance: /*dashboardData*/ ctx[0].balance
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(plans.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(plans, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const plans_changes = {};
    			if (dirty & /*dashboardData*/ 1) plans_changes.balance = /*dashboardData*/ ctx[0].balance;
    			plans.$set(plans_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(plans.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(plans.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(plans, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot.name,
    		type: "slot",
    		source: "(412:10) <Modal bind:showModal={showPurchasePlanModal}>",
    		ctx
    	});

    	return block;
    }

    function create_fragment$g(ctx) {
    	let div2;
    	let navigator;
    	let t0;
    	let div1;
    	let div0;
    	let header;
    	let t1;
    	let current_block_type_index;
    	let if_block;
    	let t2;
    	let footer;
    	let current;

    	navigator = new DashboardNavigator({
    			props: { active: "home" },
    			$$inline: true
    		});

    	header = new DashboardHeader({ $$inline: true });
    	const if_block_creators = [create_if_block$9, create_if_block_1$8, create_else_block_1$2];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*state*/ ctx[1] === NetworkStates.loaded) return 0;
    		if (/*state*/ ctx[1] === NetworkStates.error) return 1;
    		return 2;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    	footer = new DashboardFooter({ $$inline: true });

    	const block = {
    		c: function create() {
    			div2 = element("div");
    			create_component(navigator.$$.fragment);
    			t0 = space();
    			div1 = element("div");
    			div0 = element("div");
    			create_component(header.$$.fragment);
    			t1 = space();
    			if_block.c();
    			t2 = space();
    			create_component(footer.$$.fragment);
    			attr_dev(div0, "id", "content");
    			attr_dev(div0, "class", "background-color");
    			add_location(div0, file$g, 41, 6, 1456);
    			attr_dev(div1, "class", "d-flex flex-column");
    			attr_dev(div1, "id", "content-wrapper");
    			add_location(div1, file$g, 40, 4, 1395);
    			attr_dev(div2, "id", "wrapper");
    			add_location(div2, file$g, 37, 2, 1310);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div2, anchor);
    			mount_component(navigator, div2, null);
    			append_dev(div2, t0);
    			append_dev(div2, div1);
    			append_dev(div1, div0);
    			mount_component(header, div0, null);
    			append_dev(div0, t1);
    			if_blocks[current_block_type_index].m(div0, null);
    			append_dev(div1, t2);
    			mount_component(footer, div1, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				} else {
    					if_block.p(ctx, dirty);
    				}

    				transition_in(if_block, 1);
    				if_block.m(div0, null);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(navigator.$$.fragment, local);
    			transition_in(header.$$.fragment, local);
    			transition_in(if_block);
    			transition_in(footer.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(navigator.$$.fragment, local);
    			transition_out(header.$$.fragment, local);
    			transition_out(if_block);
    			transition_out(footer.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div2);
    			destroy_component(navigator);
    			destroy_component(header);
    			if_blocks[current_block_type_index].d();
    			destroy_component(footer);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$g.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$g($$self, $$props, $$invalidate) {
    	let $basicDetails;
    	validate_store(basicDetails, 'basicDetails');
    	component_subscribe($$self, basicDetails, $$value => $$invalidate(4, $basicDetails = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Overview', slots, []);

    	let dashboardData = {
    		balance: 0,
    		earnings: 0,
    		plans: 0,
    		referals: 0,
    		bonus: 0,
    		transactions: []
    	};

    	let state;
    	let errorMessage;
    	let showPurchasePlanModal = false;

    	// $: loadCharts(dashboardData)
    	const fetchData = async () => {
    		$$invalidate(1, state = NetworkStates.loading);
    		let result = await fetchAndSendDataWithJson("/dashboard");

    		if (result.status) {
    			$$invalidate(0, dashboardData = result.data);
    			$$invalidate(1, state = NetworkStates.loaded);
    		} else {
    			$$invalidate(2, errorMessage = result.message);
    			$$invalidate(1, state = NetworkStates.error);
    		}
    	};

    	onMount(() => {
    		fetchData();
    	});

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Overview> was created with unknown prop '${key}'`);
    	});

    	const click_handler = () => {
    		$$invalidate(3, showPurchasePlanModal = !showPurchasePlanModal);
    	};

    	function modal_showModal_binding(value) {
    		showPurchasePlanModal = value;
    		$$invalidate(3, showPurchasePlanModal);
    	}

    	$$self.$capture_state = () => ({
    		Footer: DashboardFooter,
    		Navigator: DashboardNavigator,
    		Header: DashboardHeader,
    		LoadingError,
    		Spinkit,
    		Modal,
    		Plans,
    		onMount,
    		fetchAndSendDataWithJson,
    		NetworkStates,
    		fetchDoughnutChart,
    		fetchLineChartData,
    		formatUTCDateToYrMntDay,
    		basicDetails,
    		actualCurrency,
    		loadCharts,
    		dashboardData,
    		state,
    		errorMessage,
    		showPurchasePlanModal,
    		fetchData,
    		$basicDetails
    	});

    	$$self.$inject_state = $$props => {
    		if ('dashboardData' in $$props) $$invalidate(0, dashboardData = $$props.dashboardData);
    		if ('state' in $$props) $$invalidate(1, state = $$props.state);
    		if ('errorMessage' in $$props) $$invalidate(2, errorMessage = $$props.errorMessage);
    		if ('showPurchasePlanModal' in $$props) $$invalidate(3, showPurchasePlanModal = $$props.showPurchasePlanModal);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		dashboardData,
    		state,
    		errorMessage,
    		showPurchasePlanModal,
    		$basicDetails,
    		fetchData,
    		click_handler,
    		modal_showModal_binding
    	];
    }

    class Overview extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$g, create_fragment$g, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Overview",
    			options,
    			id: create_fragment$g.name
    		});
    	}
    }

    /* src\components\DepositMethod.svelte generated by Svelte v3.59.2 */
    const file$f = "src\\components\\DepositMethod.svelte";

    function get_each_context$3(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[10] = list[i];
    	return child_ctx;
    }

    function get_each_context_1$1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[13] = list[i];
    	return child_ctx;
    }

    // (20:28) {#each amountList as amount}
    function create_each_block_1$1(ctx) {
    	let label;
    	let input;
    	let t0;
    	let span;
    	let t1_value = actualCurrency(/*$basicDetails*/ ctx[3].currency) + "";
    	let t1;
    	let t2_value = /*amount*/ ctx[13] + "";
    	let t2;
    	let t3;
    	let binding_group;
    	let mounted;
    	let dispose;
    	binding_group = init_binding_group(/*$$binding_groups*/ ctx[7][1]);

    	const block = {
    		c: function create() {
    			label = element("label");
    			input = element("input");
    			t0 = space();
    			span = element("span");
    			t1 = text(t1_value);
    			t2 = text(t2_value);
    			t3 = space();
    			attr_dev(input, "type", "radio");
    			attr_dev(input, "name", "amount");
    			input.__value = /*amount*/ ctx[13];
    			input.value = input.__value;
    			attr_dev(input, "class", "selectgroup-input");
    			add_location(input, file$f, 21, 36, 907);
    			attr_dev(span, "class", "selectgroup-button");
    			add_location(span, file$f, 22, 36, 1047);
    			attr_dev(label, "class", "selectgroup-item my-2");
    			add_location(label, file$f, 20, 32, 832);
    			binding_group.p(input);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, label, anchor);
    			append_dev(label, input);
    			input.checked = input.__value === /*amountChosen*/ ctx[0];
    			append_dev(label, t0);
    			append_dev(label, span);
    			append_dev(span, t1);
    			append_dev(span, t2);
    			append_dev(label, t3);

    			if (!mounted) {
    				dispose = listen_dev(input, "change", /*input_change_handler*/ ctx[6]);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*amountChosen*/ 1) {
    				input.checked = input.__value === /*amountChosen*/ ctx[0];
    			}

    			if (dirty & /*$basicDetails*/ 8 && t1_value !== (t1_value = actualCurrency(/*$basicDetails*/ ctx[3].currency) + "")) set_data_dev(t1, t1_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(label);
    			binding_group.r();
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_1$1.name,
    		type: "each",
    		source: "(20:28) {#each amountList as amount}",
    		ctx
    	});

    	return block;
    }

    // (34:32) {#each $basicDetails.paymentMethods as payment}
    function create_each_block$3(ctx) {
    	let label;
    	let input;
    	let input_value_value;
    	let value_has_changed = false;
    	let t0;
    	let span;
    	let t1_value = transformPaymentValue(/*payment*/ ctx[10]) + "";
    	let t1;
    	let t2;
    	let binding_group;
    	let mounted;
    	let dispose;
    	binding_group = init_binding_group(/*$$binding_groups*/ ctx[7][0]);

    	const block = {
    		c: function create() {
    			label = element("label");
    			input = element("input");
    			t0 = space();
    			span = element("span");
    			t1 = text(t1_value);
    			t2 = space();
    			attr_dev(input, "type", "radio");
    			attr_dev(input, "name", "payment-method");
    			input.__value = input_value_value = /*payment*/ ctx[10];
    			input.value = input.__value;
    			attr_dev(input, "class", "selectgroup-input");
    			add_location(input, file$f, 35, 40, 1962);
    			attr_dev(span, "class", "selectgroup-button text-uppercase");
    			add_location(span, file$f, 36, 40, 2117);
    			attr_dev(label, "class", "selectgroup-item my-2");
    			add_location(label, file$f, 34, 36, 1883);
    			binding_group.p(input);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, label, anchor);
    			append_dev(label, input);
    			input.checked = input.__value === /*paymentMethod*/ ctx[1];
    			append_dev(label, t0);
    			append_dev(label, span);
    			append_dev(span, t1);
    			append_dev(label, t2);

    			if (!mounted) {
    				dispose = listen_dev(input, "change", /*input_change_handler_1*/ ctx[9]);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*$basicDetails*/ 8 && input_value_value !== (input_value_value = /*payment*/ ctx[10])) {
    				prop_dev(input, "__value", input_value_value);
    				input.value = input.__value;
    				value_has_changed = true;
    			}

    			if (value_has_changed || dirty & /*paymentMethod, $basicDetails*/ 10) {
    				input.checked = input.__value === /*paymentMethod*/ ctx[1];
    			}

    			if (dirty & /*$basicDetails*/ 8 && t1_value !== (t1_value = transformPaymentValue(/*payment*/ ctx[10]) + "")) set_data_dev(t1, t1_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(label);
    			binding_group.r();
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$3.name,
    		type: "each",
    		source: "(34:32) {#each $basicDetails.paymentMethods as payment}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$f(ctx) {
    	let div13;
    	let div12;
    	let div11;
    	let div7;
    	let div6;
    	let div4;
    	let div0;
    	let t0;
    	let div1;
    	let p0;
    	let t2;
    	let input;
    	let t3;
    	let div3;
    	let p1;
    	let t5;
    	let div2;
    	let t6;
    	let div5;
    	let h3;
    	let t8;
    	let h50;
    	let strong0;
    	let t10;
    	let em0;
    	let t11_value = actualCurrency(/*$basicDetails*/ ctx[3].currency) + "";
    	let t11;

    	let t12_value = (/*amountChosen*/ ctx[0] == null
    	? 0
    	: /*amountChosen*/ ctx[0]) + "";

    	let t12;
    	let t13;
    	let h51;
    	let strong1;
    	let em1;
    	let t15_value = transformPaymentValue(/*paymentMethod*/ ctx[1]) + "";
    	let t15;
    	let t16;
    	let div10;
    	let div9;
    	let div8;
    	let button;
    	let t17;
    	let mounted;
    	let dispose;
    	let each_value_1 = /*amountList*/ ctx[4];
    	validate_each_argument(each_value_1);
    	let each_blocks_1 = [];

    	for (let i = 0; i < each_value_1.length; i += 1) {
    		each_blocks_1[i] = create_each_block_1$1(get_each_context_1$1(ctx, each_value_1, i));
    	}

    	let each_value = /*$basicDetails*/ ctx[3].paymentMethods;
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$3(get_each_context$3(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			div13 = element("div");
    			div12 = element("div");
    			div11 = element("div");
    			div7 = element("div");
    			div6 = element("div");
    			div4 = element("div");
    			div0 = element("div");

    			for (let i = 0; i < each_blocks_1.length; i += 1) {
    				each_blocks_1[i].c();
    			}

    			t0 = space();
    			div1 = element("div");
    			p0 = element("p");
    			p0.textContent = "Enter Amount";
    			t2 = space();
    			input = element("input");
    			t3 = space();
    			div3 = element("div");
    			p1 = element("p");
    			p1.textContent = "Select preferred payment method";
    			t5 = space();
    			div2 = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t6 = space();
    			div5 = element("div");
    			h3 = element("h3");
    			h3.textContent = "Deposit Summary";
    			t8 = space();
    			h50 = element("h5");
    			strong0 = element("strong");
    			strong0.textContent = "Amount:";
    			t10 = space();
    			em0 = element("em");
    			t11 = text(t11_value);
    			t12 = text(t12_value);
    			t13 = space();
    			h51 = element("h5");
    			strong1 = element("strong");
    			strong1.textContent = "Payment method: ";
    			em1 = element("em");
    			t15 = text(t15_value);
    			t16 = space();
    			div10 = element("div");
    			div9 = element("div");
    			div8 = element("div");
    			button = element("button");
    			t17 = text("Proceed with payment");
    			attr_dev(div0, "class", "selectgroup selectgroup-pills");
    			add_location(div0, file$f, 18, 24, 697);
    			set_style(p0, "color", "var(--ghost)");
    			add_location(p0, file$f, 27, 28, 1320);
    			attr_dev(input, "class", "get-started-input-fields");
    			attr_dev(input, "type", "number");
    			set_style(input, "width", "100%");
    			set_style(input, "min-height", "40px");
    			add_location(input, file$f, 28, 28, 1398);
    			attr_dev(div1, "class", "py-3");
    			add_location(div1, file$f, 26, 24, 1272);
    			set_style(p1, "color", "var(--ghost)");
    			add_location(p1, file$f, 31, 28, 1624);
    			attr_dev(div2, "class", "selectgroup selectgroup-pills");
    			add_location(div2, file$f, 32, 28, 1721);
    			attr_dev(div3, "class", "my-3");
    			add_location(div3, file$f, 30, 24, 1576);
    			attr_dev(div4, "class", "col-md-6");
    			add_location(div4, file$f, 17, 20, 649);
    			attr_dev(h3, "class", "text-uppercase");
    			set_style(h3, "color", "var(--ghost)");
    			add_location(h3, file$f, 43, 24, 2457);
    			add_location(strong0, file$f, 44, 62, 2597);
    			add_location(em0, file$f, 44, 87, 2622);
    			set_style(h50, "color", "var(--semi-white)");
    			add_location(h50, file$f, 44, 24, 2559);
    			add_location(strong1, file$f, 45, 62, 2781);
    			attr_dev(em1, "class", "text-uppercase");
    			set_style(em1, "font-size", "16px");
    			add_location(em1, file$f, 45, 95, 2814);
    			set_style(h51, "color", "var(--semi-white)");
    			add_location(h51, file$f, 45, 24, 2743);
    			attr_dev(div5, "class", "col-md-6");
    			add_location(div5, file$f, 42, 20, 2409);
    			attr_dev(div6, "class", "row");
    			add_location(div6, file$f, 16, 16, 610);
    			attr_dev(div7, "class", "container");
    			add_location(div7, file$f, 15, 12, 569);
    			button.disabled = /*disableProceedButton*/ ctx[2];
    			attr_dev(button, "class", "btn btn-primary");
    			attr_dev(button, "type", "button");
    			set_style(button, "min-width", "250px");
    			add_location(button, file$f, 51, 55, 3115);
    			attr_dev(div8, "class", "col-md-12 text-center");
    			add_location(div8, file$f, 51, 20, 3080);
    			attr_dev(div9, "class", "row");
    			add_location(div9, file$f, 50, 16, 3041);
    			attr_dev(div10, "class", "container");
    			add_location(div10, file$f, 49, 12, 3000);
    			attr_dev(div11, "class", "card-body");
    			add_location(div11, file$f, 14, 8, 532);
    			attr_dev(div12, "class", "card");
    			set_style(div12, "background", "var(--grey)");
    			add_location(div12, file$f, 13, 4, 471);
    			attr_dev(div13, "class", "d-flex justify-content-center align-items-center flex-wrap px-3 py-2 mb-3");
    			add_location(div13, file$f, 12, 0, 378);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div13, anchor);
    			append_dev(div13, div12);
    			append_dev(div12, div11);
    			append_dev(div11, div7);
    			append_dev(div7, div6);
    			append_dev(div6, div4);
    			append_dev(div4, div0);

    			for (let i = 0; i < each_blocks_1.length; i += 1) {
    				if (each_blocks_1[i]) {
    					each_blocks_1[i].m(div0, null);
    				}
    			}

    			append_dev(div4, t0);
    			append_dev(div4, div1);
    			append_dev(div1, p0);
    			append_dev(div1, t2);
    			append_dev(div1, input);
    			set_input_value(input, /*amountChosen*/ ctx[0]);
    			append_dev(div4, t3);
    			append_dev(div4, div3);
    			append_dev(div3, p1);
    			append_dev(div3, t5);
    			append_dev(div3, div2);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				if (each_blocks[i]) {
    					each_blocks[i].m(div2, null);
    				}
    			}

    			append_dev(div6, t6);
    			append_dev(div6, div5);
    			append_dev(div5, h3);
    			append_dev(div5, t8);
    			append_dev(div5, h50);
    			append_dev(h50, strong0);
    			append_dev(h50, t10);
    			append_dev(h50, em0);
    			append_dev(em0, t11);
    			append_dev(em0, t12);
    			append_dev(div5, t13);
    			append_dev(div5, h51);
    			append_dev(h51, strong1);
    			append_dev(h51, em1);
    			append_dev(em1, t15);
    			append_dev(div11, t16);
    			append_dev(div11, div10);
    			append_dev(div10, div9);
    			append_dev(div9, div8);
    			append_dev(div8, button);
    			append_dev(button, t17);

    			if (!mounted) {
    				dispose = [
    					listen_dev(input, "input", /*input_input_handler*/ ctx[8]),
    					listen_dev(button, "click", /*click_handler*/ ctx[5], false, false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*amountList, actualCurrency, $basicDetails, amountChosen*/ 25) {
    				each_value_1 = /*amountList*/ ctx[4];
    				validate_each_argument(each_value_1);
    				let i;

    				for (i = 0; i < each_value_1.length; i += 1) {
    					const child_ctx = get_each_context_1$1(ctx, each_value_1, i);

    					if (each_blocks_1[i]) {
    						each_blocks_1[i].p(child_ctx, dirty);
    					} else {
    						each_blocks_1[i] = create_each_block_1$1(child_ctx);
    						each_blocks_1[i].c();
    						each_blocks_1[i].m(div0, null);
    					}
    				}

    				for (; i < each_blocks_1.length; i += 1) {
    					each_blocks_1[i].d(1);
    				}

    				each_blocks_1.length = each_value_1.length;
    			}

    			if (dirty & /*amountChosen*/ 1 && to_number(input.value) !== /*amountChosen*/ ctx[0]) {
    				set_input_value(input, /*amountChosen*/ ctx[0]);
    			}

    			if (dirty & /*transformPaymentValue, $basicDetails, paymentMethod*/ 10) {
    				each_value = /*$basicDetails*/ ctx[3].paymentMethods;
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$3(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$3(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(div2, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}

    			if (dirty & /*$basicDetails*/ 8 && t11_value !== (t11_value = actualCurrency(/*$basicDetails*/ ctx[3].currency) + "")) set_data_dev(t11, t11_value);

    			if (dirty & /*amountChosen*/ 1 && t12_value !== (t12_value = (/*amountChosen*/ ctx[0] == null
    			? 0
    			: /*amountChosen*/ ctx[0]) + "")) set_data_dev(t12, t12_value);

    			if (dirty & /*paymentMethod*/ 2 && t15_value !== (t15_value = transformPaymentValue(/*paymentMethod*/ ctx[1]) + "")) set_data_dev(t15, t15_value);

    			if (dirty & /*disableProceedButton*/ 4) {
    				prop_dev(button, "disabled", /*disableProceedButton*/ ctx[2]);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div13);
    			destroy_each(each_blocks_1, detaching);
    			destroy_each(each_blocks, detaching);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$f.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$f($$self, $$props, $$invalidate) {
    	let disableProceedButton;
    	let $basicDetails;
    	validate_store(basicDetails, 'basicDetails');
    	component_subscribe($$self, basicDetails, $$value => $$invalidate(3, $basicDetails = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('DepositMethod', slots, []);
    	let amountList = [50, 100, 200, 500, 1000, 2000, 5000];
    	let { amountChosen } = $$props;
    	let { paymentMethod } = $$props;

    	$$self.$$.on_mount.push(function () {
    		if (amountChosen === undefined && !('amountChosen' in $$props || $$self.$$.bound[$$self.$$.props['amountChosen']])) {
    			console.warn("<DepositMethod> was created without expected prop 'amountChosen'");
    		}

    		if (paymentMethod === undefined && !('paymentMethod' in $$props || $$self.$$.bound[$$self.$$.props['paymentMethod']])) {
    			console.warn("<DepositMethod> was created without expected prop 'paymentMethod'");
    		}
    	});

    	const writable_props = ['amountChosen', 'paymentMethod'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<DepositMethod> was created with unknown prop '${key}'`);
    	});

    	const $$binding_groups = [[], []];

    	function click_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function input_change_handler() {
    		amountChosen = this.__value;
    		$$invalidate(0, amountChosen);
    	}

    	function input_input_handler() {
    		amountChosen = to_number(this.value);
    		$$invalidate(0, amountChosen);
    	}

    	function input_change_handler_1() {
    		paymentMethod = this.__value;
    		$$invalidate(1, paymentMethod);
    	}

    	$$self.$$set = $$props => {
    		if ('amountChosen' in $$props) $$invalidate(0, amountChosen = $$props.amountChosen);
    		if ('paymentMethod' in $$props) $$invalidate(1, paymentMethod = $$props.paymentMethod);
    	};

    	$$self.$capture_state = () => ({
    		transformPaymentValue,
    		basicDetails,
    		actualCurrency,
    		amountList,
    		amountChosen,
    		paymentMethod,
    		disableProceedButton,
    		$basicDetails
    	});

    	$$self.$inject_state = $$props => {
    		if ('amountList' in $$props) $$invalidate(4, amountList = $$props.amountList);
    		if ('amountChosen' in $$props) $$invalidate(0, amountChosen = $$props.amountChosen);
    		if ('paymentMethod' in $$props) $$invalidate(1, paymentMethod = $$props.paymentMethod);
    		if ('disableProceedButton' in $$props) $$invalidate(2, disableProceedButton = $$props.disableProceedButton);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*amountChosen*/ 1) {
    			$$invalidate(2, disableProceedButton = amountChosen == null || amountChosen < 50);
    		}
    	};

    	return [
    		amountChosen,
    		paymentMethod,
    		disableProceedButton,
    		$basicDetails,
    		amountList,
    		click_handler,
    		input_change_handler,
    		$$binding_groups,
    		input_input_handler,
    		input_change_handler_1
    	];
    }

    class DepositMethod extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$f, create_fragment$f, safe_not_equal, { amountChosen: 0, paymentMethod: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "DepositMethod",
    			options,
    			id: create_fragment$f.name
    		});
    	}

    	get amountChosen() {
    		throw new Error("<DepositMethod>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set amountChosen(value) {
    		throw new Error("<DepositMethod>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get paymentMethod() {
    		throw new Error("<DepositMethod>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set paymentMethod(value) {
    		throw new Error("<DepositMethod>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\components\DepositConfirmation.svelte generated by Svelte v3.59.2 */

    const file$e = "src\\components\\DepositConfirmation.svelte";

    // (100:0) {:else}
    function create_else_block$8(ctx) {
    	let loadingerror;
    	let current;

    	loadingerror = new LoadingError({
    			props: { message: /*errorMessage*/ ctx[5] },
    			$$inline: true
    		});

    	loadingerror.$on("click", /*fetchData*/ ctx[13]);

    	const block = {
    		c: function create() {
    			create_component(loadingerror.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(loadingerror, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const loadingerror_changes = {};
    			if (dirty & /*errorMessage*/ 32) loadingerror_changes.message = /*errorMessage*/ ctx[5];
    			loadingerror.$set(loadingerror_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(loadingerror.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(loadingerror.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(loadingerror, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$8.name,
    		type: "else",
    		source: "(100:0) {:else}",
    		ctx
    	});

    	return block;
    }

    // (98:42) 
    function create_if_block_1$7(ctx) {
    	let spinkit;
    	let current;
    	spinkit = new Spinkit({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(spinkit.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(spinkit, target, anchor);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(spinkit.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(spinkit.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(spinkit, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$7.name,
    		type: "if",
    		source: "(98:42) ",
    		ctx
    	});

    	return block;
    }

    // (73:0) {#if state === NetworkStates.loaded}
    function create_if_block$8(ctx) {
    	let div2;
    	let form;
    	let h4;
    	let t0;
    	let strong;
    	let t1_value = actualCurrency(/*$basicDetails*/ ctx[9].currency) + "";
    	let t1;
    	let t2;
    	let t3;
    	let t4;
    	let label0;
    	let t5_value = transformPaymentValue(/*method*/ ctx[0]) + "";
    	let t5;
    	let t6;
    	let t7;
    	let div0;
    	let input0;
    	let t8;
    	let input1;
    	let t9;
    	let span0;
    	let a;
    	let svg;
    	let path;
    	let t10;
    	let img;
    	let img_src_value;
    	let t11;
    	let label1;
    	let t13;
    	let h6;
    	let t15;
    	let div1;
    	let button;
    	let span1;
    	let t16;
    	let button_disabled_value;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			div2 = element("div");
    			form = element("form");
    			h4 = element("h4");
    			t0 = text("You are to make a ");
    			strong = element("strong");
    			t1 = text(t1_value);
    			t2 = text(/*amount*/ ctx[1]);
    			t3 = text(" payment using the payment method you selected.");
    			t4 = space();
    			label0 = element("label");
    			t5 = text(t5_value);
    			t6 = text(" Address");
    			t7 = space();
    			div0 = element("div");
    			input0 = element("input");
    			t8 = space();
    			input1 = element("input");
    			t9 = space();
    			span0 = element("span");
    			a = element("a");
    			svg = svg_element("svg");
    			path = svg_element("path");
    			t10 = space();
    			img = element("img");
    			t11 = space();
    			label1 = element("label");
    			label1.textContent = "Send the exact amount to the wallet supplied above using any platform of your choice. And click the image to upload receipt.";
    			t13 = space();
    			h6 = element("h6");
    			h6.textContent = "You will receive information upon payment confirmation.";
    			t15 = space();
    			div1 = element("div");
    			button = element("button");
    			span1 = element("span");
    			t16 = text(" submit payment");
    			add_location(strong, file$e, 75, 54, 2407);
    			attr_dev(h4, "class", "text-center");
    			add_location(h4, file$e, 75, 12, 2365);
    			attr_dev(label0, "class", "form-label text-end text-capitalize");
    			attr_dev(label0, "for", "address");
    			set_style(label0, "margin", "0px");
    			set_style(label0, "font-size", "14px");
    			set_style(label0, "width", "100%");
    			add_location(label0, file$e, 76, 12, 2538);
    			attr_dev(input0, "class", "form-control");
    			attr_dev(input0, "type", "text");
    			set_style(input0, "margin", "0px 0px 12px");
    			attr_dev(input0, "name", "address");
    			input0.readOnly = true;
    			input0.disabled = true;
    			add_location(input0, file$e, 77, 41, 2742);
    			attr_dev(input1, "type", "file");
    			attr_dev(input1, "name", "file");
    			attr_dev(input1, "id", "file");
    			attr_dev(input1, "class", "d-none");
    			attr_dev(input1, "accept", "image/*");
    			add_location(input1, file$e, 78, 16, 2884);
    			attr_dev(path, "fill-rule", "evenodd");
    			attr_dev(path, "d", "M4 2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2zm2-1a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1zM2 5a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1v-1h1v1a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h1v1z");
    			add_location(path, file$e, 82, 28, 3350);
    			attr_dev(svg, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg, "width", "16");
    			attr_dev(svg, "height", "16");
    			attr_dev(svg, "fill", "currentColor");
    			attr_dev(svg, "class", "bi bi-copy");
    			attr_dev(svg, "viewBox", "0 0 16 16");
    			add_location(svg, file$e, 81, 24, 3198);
    			attr_dev(a, "class", "me-2");
    			attr_dev(a, "href", "");
    			add_location(a, file$e, 80, 20, 3100);
    			attr_dev(span0, "class", "d-flex justify-content-end w-100 mb-2");
    			set_style(span0, "height", "auto");
    			add_location(span0, file$e, 79, 16, 3004);
    			if (!src_url_equal(img.src, img_src_value = defaultImageSrc)) attr_dev(img, "src", img_src_value);
    			set_style(img, "display", "block");
    			set_style(img, "margin-left", "auto");
    			set_style(img, "margin-right", "auto");
    			set_style(img, "max-width", "250px");
    			set_style(img, "max-height", "250px");
    			attr_dev(img, "alt", "");
    			add_location(img, file$e, 86, 16, 3725);
    			attr_dev(label1, "class", "form-label text-center");
    			attr_dev(label1, "for", "file");
    			set_style(label1, "font-size", "13px");
    			set_style(label1, "margin", "11px");
    			add_location(label1, file$e, 87, 16, 3917);
    			attr_dev(div0, "class", "form-group mb-3");
    			add_location(div0, file$e, 77, 12, 2713);
    			attr_dev(h6, "class", "text-center");
    			set_style(h6, "margin", "0px");
    			add_location(h6, file$e, 89, 12, 4170);
    			attr_dev(span1, "class", "spinner-grow spinner-grow-sm");
    			attr_dev(span1, "role", "status");
    			attr_dev(span1, "aria-hidden", "true");
    			toggle_class(span1, "d-none", !/*isSubmitting*/ ctx[7]);
    			add_location(span1, file$e, 92, 20, 4496);
    			button.disabled = button_disabled_value = !/*isSubmitable*/ ctx[6] || /*isSubmitting*/ ctx[7];
    			attr_dev(button, "class", "btn btn-primary");
    			set_style(button, "width", "50%");
    			set_style(button, "margin", "30px 0px 0px");
    			set_style(button, "padding", "16px");
    			attr_dev(button, "type", "submit");
    			add_location(button, file$e, 91, 16, 4332);
    			attr_dev(div1, "class", "text-center");
    			add_location(div1, file$e, 90, 12, 4289);
    			attr_dev(form, "class", "col-12 col-md-4 m-2 px-2 py-3");
    			attr_dev(form, "method", "post");
    			set_style(form, "background", "var(--grey)");
    			add_location(form, file$e, 74, 8, 2198);
    			attr_dev(div2, "class", "d-flex justify-content-center align-items-center mb-2");
    			add_location(div2, file$e, 73, 4, 2121);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div2, anchor);
    			append_dev(div2, form);
    			append_dev(form, h4);
    			append_dev(h4, t0);
    			append_dev(h4, strong);
    			append_dev(strong, t1);
    			append_dev(strong, t2);
    			append_dev(h4, t3);
    			append_dev(form, t4);
    			append_dev(form, label0);
    			append_dev(label0, t5);
    			append_dev(label0, t6);
    			append_dev(form, t7);
    			append_dev(form, div0);
    			append_dev(div0, input0);
    			set_input_value(input0, /*address*/ ctx[8]);
    			append_dev(div0, t8);
    			append_dev(div0, input1);
    			append_dev(div0, t9);
    			append_dev(div0, span0);
    			append_dev(span0, a);
    			append_dev(a, svg);
    			append_dev(svg, path);
    			append_dev(div0, t10);
    			append_dev(div0, img);
    			/*img_binding*/ ctx[16](img);
    			append_dev(div0, t11);
    			append_dev(div0, label1);
    			append_dev(form, t13);
    			append_dev(form, h6);
    			append_dev(form, t15);
    			append_dev(form, div1);
    			append_dev(div1, button);
    			append_dev(button, span1);
    			append_dev(button, t16);
    			/*form_binding*/ ctx[17](form);

    			if (!mounted) {
    				dispose = [
    					listen_dev(input0, "input", /*input0_input_handler*/ ctx[14]),
    					listen_dev(input1, "change", /*onFileSelected*/ ctx[11], false, false, false, false),
    					listen_dev(a, "click", /*click_handler*/ ctx[15], false, false, false, false),
    					listen_dev(img, "click", /*selectImg*/ ctx[10], false, false, false, false),
    					listen_dev(form, "submit", prevent_default(/*submitPayment*/ ctx[12]), false, true, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*$basicDetails*/ 512 && t1_value !== (t1_value = actualCurrency(/*$basicDetails*/ ctx[9].currency) + "")) set_data_dev(t1, t1_value);
    			if (dirty & /*amount*/ 2) set_data_dev(t2, /*amount*/ ctx[1]);
    			if (dirty & /*method*/ 1 && t5_value !== (t5_value = transformPaymentValue(/*method*/ ctx[0]) + "")) set_data_dev(t5, t5_value);

    			if (dirty & /*address*/ 256 && input0.value !== /*address*/ ctx[8]) {
    				set_input_value(input0, /*address*/ ctx[8]);
    			}

    			if (dirty & /*isSubmitting*/ 128) {
    				toggle_class(span1, "d-none", !/*isSubmitting*/ ctx[7]);
    			}

    			if (dirty & /*isSubmitable, isSubmitting*/ 192 && button_disabled_value !== (button_disabled_value = !/*isSubmitable*/ ctx[6] || /*isSubmitting*/ ctx[7])) {
    				prop_dev(button, "disabled", button_disabled_value);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div2);
    			/*img_binding*/ ctx[16](null);
    			/*form_binding*/ ctx[17](null);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$8.name,
    		type: "if",
    		source: "(73:0) {#if state === NetworkStates.loaded}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$e(ctx) {
    	let current_block_type_index;
    	let if_block;
    	let if_block_anchor;
    	let current;
    	const if_block_creators = [create_if_block$8, create_if_block_1$7, create_else_block$8];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*state*/ ctx[4] === NetworkStates.loaded) return 0;
    		if (/*state*/ ctx[4] === NetworkStates.loading) return 1;
    		return 2;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block = {
    		c: function create() {
    			if_block.c();
    			if_block_anchor = empty();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if_blocks[current_block_type_index].m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				} else {
    					if_block.p(ctx, dirty);
    				}

    				transition_in(if_block, 1);
    				if_block.m(if_block_anchor.parentNode, if_block_anchor);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if_blocks[current_block_type_index].d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$e.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    const defaultImageSrc = "/assets/img/untitled.png";

    function instance$e($$self, $$props, $$invalidate) {
    	let $basicDetails;
    	validate_store(basicDetails, 'basicDetails');
    	component_subscribe($$self, basicDetails, $$value => $$invalidate(9, $basicDetails = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('DepositConfirmation', slots, []);
    	let { method } = $$props;
    	let { amount } = $$props;
    	let fileForm;
    	let imgHolder;
    	let state;
    	let errorMessage;
    	let isSubmitable = false;
    	let isSubmitting = false;
    	let address = '';

    	function selectImg() {
    		fileForm.file.click();
    	}

    	function reset() {
    		$$invalidate(2, fileForm.file.value = null, fileForm);
    		$$invalidate(6, isSubmitable = false);
    		$$invalidate(3, imgHolder.src = defaultImageSrc, imgHolder);
    	}

    	function onFileSelected(evt) {
    		const file = evt.target.files[0];

    		if (fileTypes.includes(file.type)) {
    			$$invalidate(3, imgHolder.src = URL.createObjectURL(file), imgHolder);
    			$$invalidate(6, isSubmitable = true);
    		} else {
    			reset();
    			alertUser("File Format", "Invalid Image Format", "error");
    		}
    	}

    	async function submitPayment() {
    		$$invalidate(7, isSubmitting = true);
    		let result = await sendDataAndFile("/deposit", fileForm, { method, amount });
    		$$invalidate(7, isSubmitting = false);

    		if (result.status) {
    			reset();
    			alertUser("", result.message, "success");
    		} else {
    			alertUser("", result.message, "error");
    		}
    	}

    	const fetchData = async () => {
    		// can't include body to a get request
    		$$invalidate(4, state = NetworkStates.loading);

    		let result = await fetchAndSendDataWithJson(`/deposit/${method}`);

    		if (result.status) {
    			$$invalidate(4, state = NetworkStates.loaded);
    			$$invalidate(8, address = result.data.address);
    		} else {
    			$$invalidate(4, state = NetworkStates.error);
    			$$invalidate(5, errorMessage = result.message);
    		}
    	};

    	onMount(() => {
    		fetchData();
    	});

    	$$self.$$.on_mount.push(function () {
    		if (method === undefined && !('method' in $$props || $$self.$$.bound[$$self.$$.props['method']])) {
    			console.warn("<DepositConfirmation> was created without expected prop 'method'");
    		}

    		if (amount === undefined && !('amount' in $$props || $$self.$$.bound[$$self.$$.props['amount']])) {
    			console.warn("<DepositConfirmation> was created without expected prop 'amount'");
    		}
    	});

    	const writable_props = ['method', 'amount'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<DepositConfirmation> was created with unknown prop '${key}'`);
    	});

    	function input0_input_handler() {
    		address = this.value;
    		$$invalidate(8, address);
    	}

    	const click_handler = () => {
    		referralLink(address, false);
    	};

    	function img_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			imgHolder = $$value;
    			$$invalidate(3, imgHolder);
    		});
    	}

    	function form_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			fileForm = $$value;
    			$$invalidate(2, fileForm);
    		});
    	}

    	$$self.$$set = $$props => {
    		if ('method' in $$props) $$invalidate(0, method = $$props.method);
    		if ('amount' in $$props) $$invalidate(1, amount = $$props.amount);
    	};

    	$$self.$capture_state = () => ({
    		Spinkit,
    		LoadingError,
    		onMount,
    		transformPaymentValue,
    		alertUser,
    		fileTypes,
    		sendDataAndFile,
    		NetworkStates,
    		fetchAndSendDataWithJson,
    		basicDetails,
    		actualCurrency,
    		referralLink,
    		method,
    		amount,
    		defaultImageSrc,
    		fileForm,
    		imgHolder,
    		state,
    		errorMessage,
    		isSubmitable,
    		isSubmitting,
    		address,
    		selectImg,
    		reset,
    		onFileSelected,
    		submitPayment,
    		fetchData,
    		$basicDetails
    	});

    	$$self.$inject_state = $$props => {
    		if ('method' in $$props) $$invalidate(0, method = $$props.method);
    		if ('amount' in $$props) $$invalidate(1, amount = $$props.amount);
    		if ('fileForm' in $$props) $$invalidate(2, fileForm = $$props.fileForm);
    		if ('imgHolder' in $$props) $$invalidate(3, imgHolder = $$props.imgHolder);
    		if ('state' in $$props) $$invalidate(4, state = $$props.state);
    		if ('errorMessage' in $$props) $$invalidate(5, errorMessage = $$props.errorMessage);
    		if ('isSubmitable' in $$props) $$invalidate(6, isSubmitable = $$props.isSubmitable);
    		if ('isSubmitting' in $$props) $$invalidate(7, isSubmitting = $$props.isSubmitting);
    		if ('address' in $$props) $$invalidate(8, address = $$props.address);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		method,
    		amount,
    		fileForm,
    		imgHolder,
    		state,
    		errorMessage,
    		isSubmitable,
    		isSubmitting,
    		address,
    		$basicDetails,
    		selectImg,
    		onFileSelected,
    		submitPayment,
    		fetchData,
    		input0_input_handler,
    		click_handler,
    		img_binding,
    		form_binding
    	];
    }

    class DepositConfirmation extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$e, create_fragment$e, safe_not_equal, { method: 0, amount: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "DepositConfirmation",
    			options,
    			id: create_fragment$e.name
    		});
    	}

    	get method() {
    		throw new Error("<DepositConfirmation>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set method(value) {
    		throw new Error("<DepositConfirmation>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get amount() {
    		throw new Error("<DepositConfirmation>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set amount(value) {
    		throw new Error("<DepositConfirmation>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\pages\dashboard\Deposit.svelte generated by Svelte v3.59.2 */
    const file$d = "src\\pages\\dashboard\\Deposit.svelte";

    // (34:12) {:else}
    function create_else_block$7(ctx) {
    	let depositmethod;
    	let updating_amountChosen;
    	let updating_paymentMethod;
    	let current;

    	function depositmethod_amountChosen_binding(value) {
    		/*depositmethod_amountChosen_binding*/ ctx[5](value);
    	}

    	function depositmethod_paymentMethod_binding(value) {
    		/*depositmethod_paymentMethod_binding*/ ctx[6](value);
    	}

    	let depositmethod_props = {};

    	if (/*amountChosen*/ ctx[1] !== void 0) {
    		depositmethod_props.amountChosen = /*amountChosen*/ ctx[1];
    	}

    	if (/*paymentMethod*/ ctx[2] !== void 0) {
    		depositmethod_props.paymentMethod = /*paymentMethod*/ ctx[2];
    	}

    	depositmethod = new DepositMethod({
    			props: depositmethod_props,
    			$$inline: true
    		});

    	binding_callbacks.push(() => bind(depositmethod, 'amountChosen', depositmethod_amountChosen_binding));
    	binding_callbacks.push(() => bind(depositmethod, 'paymentMethod', depositmethod_paymentMethod_binding));
    	depositmethod.$on("click", /*proceedToConfirmation*/ ctx[4]);

    	const block = {
    		c: function create() {
    			create_component(depositmethod.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(depositmethod, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const depositmethod_changes = {};

    			if (!updating_amountChosen && dirty & /*amountChosen*/ 2) {
    				updating_amountChosen = true;
    				depositmethod_changes.amountChosen = /*amountChosen*/ ctx[1];
    				add_flush_callback(() => updating_amountChosen = false);
    			}

    			if (!updating_paymentMethod && dirty & /*paymentMethod*/ 4) {
    				updating_paymentMethod = true;
    				depositmethod_changes.paymentMethod = /*paymentMethod*/ ctx[2];
    				add_flush_callback(() => updating_paymentMethod = false);
    			}

    			depositmethod.$set(depositmethod_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(depositmethod.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(depositmethod.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(depositmethod, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$7.name,
    		type: "else",
    		source: "(34:12) {:else}",
    		ctx
    	});

    	return block;
    }

    // (32:12) {#if shouldDisplayPaymentConfirmation}
    function create_if_block$7(ctx) {
    	let depositconfirmation;
    	let current;

    	depositconfirmation = new DepositConfirmation({
    			props: {
    				method: /*params*/ ctx[0].method,
    				amount: /*params*/ ctx[0].amount
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(depositconfirmation.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(depositconfirmation, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const depositconfirmation_changes = {};
    			if (dirty & /*params*/ 1) depositconfirmation_changes.method = /*params*/ ctx[0].method;
    			if (dirty & /*params*/ 1) depositconfirmation_changes.amount = /*params*/ ctx[0].amount;
    			depositconfirmation.$set(depositconfirmation_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(depositconfirmation.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(depositconfirmation.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(depositconfirmation, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$7.name,
    		type: "if",
    		source: "(32:12) {#if shouldDisplayPaymentConfirmation}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$d(ctx) {
    	let div3;
    	let navigator;
    	let t0;
    	let div2;
    	let div1;
    	let header;
    	let t1;
    	let div0;
    	let h3;
    	let t3;
    	let current_block_type_index;
    	let if_block;
    	let t4;
    	let footer;
    	let current;

    	navigator = new DashboardNavigator({
    			props: { active: "deposit" },
    			$$inline: true
    		});

    	header = new DashboardHeader({ $$inline: true });
    	const if_block_creators = [create_if_block$7, create_else_block$7];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*shouldDisplayPaymentConfirmation*/ ctx[3]) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    	footer = new DashboardFooter({ $$inline: true });

    	const block = {
    		c: function create() {
    			div3 = element("div");
    			create_component(navigator.$$.fragment);
    			t0 = space();
    			div2 = element("div");
    			div1 = element("div");
    			create_component(header.$$.fragment);
    			t1 = space();
    			div0 = element("div");
    			h3 = element("h3");
    			h3.textContent = "Deposit";
    			t3 = space();
    			if_block.c();
    			t4 = space();
    			create_component(footer.$$.fragment);
    			attr_dev(h3, "class", "mb-1");
    			set_style(h3, "color", "var(--white)");
    			add_location(h3, file$d, 27, 16, 1002);
    			attr_dev(div0, "class", "container-fluid");
    			add_location(div0, file$d, 26, 12, 955);
    			attr_dev(div1, "id", "content");
    			attr_dev(div1, "class", "background-color");
    			add_location(div1, file$d, 23, 8, 840);
    			attr_dev(div2, "class", "d-flex flex-column");
    			attr_dev(div2, "id", "content-wrapper");
    			add_location(div2, file$d, 22, 4, 777);
    			attr_dev(div3, "id", "wrapper");
    			add_location(div3, file$d, 19, 0, 689);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div3, anchor);
    			mount_component(navigator, div3, null);
    			append_dev(div3, t0);
    			append_dev(div3, div2);
    			append_dev(div2, div1);
    			mount_component(header, div1, null);
    			append_dev(div1, t1);
    			append_dev(div1, div0);
    			append_dev(div0, h3);
    			append_dev(div1, t3);
    			if_blocks[current_block_type_index].m(div1, null);
    			append_dev(div2, t4);
    			mount_component(footer, div2, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				} else {
    					if_block.p(ctx, dirty);
    				}

    				transition_in(if_block, 1);
    				if_block.m(div1, null);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(navigator.$$.fragment, local);
    			transition_in(header.$$.fragment, local);
    			transition_in(if_block);
    			transition_in(footer.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(navigator.$$.fragment, local);
    			transition_out(header.$$.fragment, local);
    			transition_out(if_block);
    			transition_out(footer.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div3);
    			destroy_component(navigator);
    			destroy_component(header);
    			if_blocks[current_block_type_index].d();
    			destroy_component(footer);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$d.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$d($$self, $$props, $$invalidate) {
    	let shouldDisplayPaymentConfirmation;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Deposit', slots, []);
    	let { params } = $$props;
    	let amountChosen = 50;
    	let paymentMethod = "bitcoin";

    	function proceedToConfirmation() {
    		location.assign(`/deposit/${paymentMethod}/${amountChosen}`);
    	}

    	$$self.$$.on_mount.push(function () {
    		if (params === undefined && !('params' in $$props || $$self.$$.bound[$$self.$$.props['params']])) {
    			console.warn("<Deposit> was created without expected prop 'params'");
    		}
    	});

    	const writable_props = ['params'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Deposit> was created with unknown prop '${key}'`);
    	});

    	function depositmethod_amountChosen_binding(value) {
    		amountChosen = value;
    		$$invalidate(1, amountChosen);
    	}

    	function depositmethod_paymentMethod_binding(value) {
    		paymentMethod = value;
    		$$invalidate(2, paymentMethod);
    	}

    	$$self.$$set = $$props => {
    		if ('params' in $$props) $$invalidate(0, params = $$props.params);
    	};

    	$$self.$capture_state = () => ({
    		Footer: DashboardFooter,
    		Navigator: DashboardNavigator,
    		Header: DashboardHeader,
    		DepositMethod,
    		DepositConfirmation,
    		params,
    		amountChosen,
    		paymentMethod,
    		proceedToConfirmation,
    		shouldDisplayPaymentConfirmation
    	});

    	$$self.$inject_state = $$props => {
    		if ('params' in $$props) $$invalidate(0, params = $$props.params);
    		if ('amountChosen' in $$props) $$invalidate(1, amountChosen = $$props.amountChosen);
    		if ('paymentMethod' in $$props) $$invalidate(2, paymentMethod = $$props.paymentMethod);
    		if ('shouldDisplayPaymentConfirmation' in $$props) $$invalidate(3, shouldDisplayPaymentConfirmation = $$props.shouldDisplayPaymentConfirmation);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*params*/ 1) {
    			$$invalidate(3, shouldDisplayPaymentConfirmation = params !== null && params !== undefined);
    		}
    	};

    	return [
    		params,
    		amountChosen,
    		paymentMethod,
    		shouldDisplayPaymentConfirmation,
    		proceedToConfirmation,
    		depositmethod_amountChosen_binding,
    		depositmethod_paymentMethod_binding
    	];
    }

    class Deposit extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$d, create_fragment$d, safe_not_equal, { params: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Deposit",
    			options,
    			id: create_fragment$d.name
    		});
    	}

    	get params() {
    		throw new Error("<Deposit>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set params(value) {
    		throw new Error("<Deposit>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\pages\dashboard\Profile.svelte generated by Svelte v3.59.2 */
    const file$c = "src\\pages\\dashboard\\Profile.svelte";

    // (187:16) {:else}
    function create_else_block$6(ctx) {
    	let loadingerror;
    	let current;

    	loadingerror = new LoadingError({
    			props: { message: /*errorMessage*/ ctx[3] },
    			$$inline: true
    		});

    	loadingerror.$on("click", /*fetchData*/ ctx[13]);

    	const block = {
    		c: function create() {
    			create_component(loadingerror.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(loadingerror, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const loadingerror_changes = {};
    			if (dirty & /*errorMessage*/ 8) loadingerror_changes.message = /*errorMessage*/ ctx[3];
    			loadingerror.$set(loadingerror_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(loadingerror.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(loadingerror.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(loadingerror, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$6.name,
    		type: "else",
    		source: "(187:16) {:else}",
    		ctx
    	});

    	return block;
    }

    // (185:57) 
    function create_if_block_1$6(ctx) {
    	let spinkit;
    	let current;
    	spinkit = new Spinkit({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(spinkit.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(spinkit, target, anchor);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(spinkit.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(spinkit.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(spinkit, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$6.name,
    		type: "if",
    		source: "(185:57) ",
    		ctx
    	});

    	return block;
    }

    // (81:16) {#if state === NetworkStates.loaded}
    function create_if_block$6(ctx) {
    	let div33;
    	let h3;
    	let t1;
    	let div32;
    	let div4;
    	let div3;
    	let form0;
    	let div2;
    	let img;
    	let img_src_value;
    	let t2;
    	let input0;
    	let t3;
    	let div0;
    	let button0;
    	let span0;
    	let t4;
    	let t5;
    	let t6;
    	let div1;
    	let button1;
    	let t8;
    	let div31;
    	let div30;
    	let div29;
    	let div18;
    	let div5;
    	let p0;
    	let t10;
    	let button2;
    	let t11;
    	let t12;
    	let div17;
    	let form1;
    	let div10;
    	let div7;
    	let div6;
    	let label0;
    	let strong0;
    	let input1;
    	let t14;
    	let div9;
    	let div8;
    	let label1;
    	let strong1;
    	let input2;
    	let t16;
    	let div15;
    	let div12;
    	let div11;
    	let label2;
    	let strong2;
    	let input3;
    	let t18;
    	let div14;
    	let div13;
    	let label3;
    	let strong3;
    	let input4;
    	let t20;
    	let div16;
    	let button3;
    	let span1;
    	let t21;
    	let t22;
    	let div28;
    	let div19;
    	let p1;
    	let t24;
    	let button4;
    	let t25;
    	let t26;
    	let div27;
    	let form2;
    	let div20;
    	let label4;
    	let strong4;
    	let input5;
    	let t28;
    	let div25;
    	let div22;
    	let div21;
    	let label5;
    	let strong5;
    	let input6;
    	let t30;
    	let div24;
    	let div23;
    	let label6;
    	let strong6;
    	let input7;
    	let t32;
    	let div26;
    	let button5;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			div33 = element("div");
    			h3 = element("h3");
    			h3.textContent = "Profile";
    			t1 = space();
    			div32 = element("div");
    			div4 = element("div");
    			div3 = element("div");
    			form0 = element("form");
    			div2 = element("div");
    			img = element("img");
    			t2 = space();
    			input0 = element("input");
    			t3 = space();
    			div0 = element("div");
    			button0 = element("button");
    			span0 = element("span");
    			t4 = space();
    			t5 = text(/*changePhotoButtonText*/ ctx[8]);
    			t6 = space();
    			div1 = element("div");
    			button1 = element("button");
    			button1.textContent = "Cancel";
    			t8 = space();
    			div31 = element("div");
    			div30 = element("div");
    			div29 = element("div");
    			div18 = element("div");
    			div5 = element("div");
    			p0 = element("p");
    			p0.textContent = "Basic Details";
    			t10 = space();
    			button2 = element("button");
    			t11 = text(/*editBasicContactTitle*/ ctx[11]);
    			t12 = space();
    			div17 = element("div");
    			form1 = element("form");
    			div10 = element("div");
    			div7 = element("div");
    			div6 = element("div");
    			label0 = element("label");
    			strong0 = element("strong");
    			strong0.textContent = "Firstname";
    			input1 = element("input");
    			t14 = space();
    			div9 = element("div");
    			div8 = element("div");
    			label1 = element("label");
    			strong1 = element("strong");
    			strong1.textContent = "Lastname";
    			input2 = element("input");
    			t16 = space();
    			div15 = element("div");
    			div12 = element("div");
    			div11 = element("div");
    			label2 = element("label");
    			strong2 = element("strong");
    			strong2.textContent = "Email";
    			input3 = element("input");
    			t18 = space();
    			div14 = element("div");
    			div13 = element("div");
    			label3 = element("label");
    			strong3 = element("strong");
    			strong3.textContent = "Phone";
    			input4 = element("input");
    			t20 = space();
    			div16 = element("div");
    			button3 = element("button");
    			span1 = element("span");
    			t21 = text(" Save Settings");
    			t22 = space();
    			div28 = element("div");
    			div19 = element("div");
    			p1 = element("p");
    			p1.textContent = "Contact Details";
    			t24 = space();
    			button4 = element("button");
    			t25 = text(/*editContactDetailsTitle*/ ctx[9]);
    			t26 = space();
    			div27 = element("div");
    			form2 = element("form");
    			div20 = element("div");
    			label4 = element("label");
    			strong4 = element("strong");
    			strong4.textContent = "Address";
    			input5 = element("input");
    			t28 = space();
    			div25 = element("div");
    			div22 = element("div");
    			div21 = element("div");
    			label5 = element("label");
    			strong5 = element("strong");
    			strong5.textContent = "State";
    			input6 = element("input");
    			t30 = space();
    			div24 = element("div");
    			div23 = element("div");
    			label6 = element("label");
    			strong6 = element("strong");
    			strong6.textContent = "Country";
    			input7 = element("input");
    			t32 = space();
    			div26 = element("div");
    			button5 = element("button");
    			button5.textContent = "Save Settings";
    			attr_dev(h3, "class", "mb-4 text-white");
    			add_location(h3, file$c, 82, 24, 2839);
    			attr_dev(img, "class", "rounded-circle mb-3 mt-4");
    			if (!src_url_equal(img.src, img_src_value = /*data*/ ctx[4].picture)) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "width", "160");
    			attr_dev(img, "height", "160");
    			attr_dev(img, "alt", "profile_picture");
    			add_location(img, file$c, 91, 44, 3480);
    			attr_dev(input0, "type", "file");
    			attr_dev(input0, "name", "file");
    			attr_dev(input0, "class", "d-none");
    			add_location(input0, file$c, 92, 44, 3654);
    			attr_dev(span0, "class", "spinner-grow spinner-grow-sm");
    			attr_dev(span0, "role", "status");
    			attr_dev(span0, "aria-hidden", "true");
    			toggle_class(span0, "d-none", !/*isSubmittingProfilePhoto*/ ctx[5]);
    			add_location(span0, file$c, 106, 52, 4892);
    			attr_dev(button0, "class", "btn btn-primary btn-sm");
    			button0.disabled = /*isSubmittingProfilePhoto*/ ctx[5];
    			attr_dev(button0, "type", "button");
    			add_location(button0, file$c, 105, 48, 4714);
    			attr_dev(div0, "class", "mb-3");
    			add_location(div0, file$c, 104, 44, 4646);
    			attr_dev(button1, "class", "text-button");
    			set_style(button1, "color", "var(--orange-red)");
    			add_location(button1, file$c, 110, 48, 5281);
    			toggle_class(div1, "d-none", !/*isSubmitable*/ ctx[1]);
    			add_location(div1, file$c, 109, 44, 5197);
    			attr_dev(div2, "class", "card-body text-center shadow content-color");
    			add_location(div2, file$c, 90, 40, 3378);
    			add_location(form0, file$c, 86, 36, 3074);
    			attr_dev(div3, "class", "card mb-3");
    			add_location(div3, file$c, 85, 32, 3013);
    			attr_dev(div4, "class", "col-lg-4");
    			add_location(div4, file$c, 84, 28, 2957);
    			attr_dev(p0, "class", "m-0 fw-bold");
    			add_location(p0, file$c, 126, 48, 6330);
    			attr_dev(button2, "class", "text-button d-none");
    			add_location(button2, file$c, 127, 48, 6420);
    			attr_dev(div5, "class", "card-header py-3 content-color d-flex justify-content-between align-items-center");
    			add_location(div5, file$c, 125, 44, 6186);
    			add_location(strong0, file$c, 135, 120, 7092);
    			attr_dev(label0, "class", "form-label");
    			attr_dev(label0, "for", "firstname");
    			add_location(label0, file$c, 135, 78, 7050);
    			attr_dev(input1, "class", "get-started-input-fields text-capitalize");
    			input1.disabled = /*borderlessInput*/ ctx[12];
    			attr_dev(input1, "type", "text");
    			attr_dev(input1, "id", "firstname");
    			attr_dev(input1, "placeholder", "John");
    			attr_dev(input1, "name", "firstname");
    			toggle_class(input1, "borderless-input", /*borderlessInput*/ ctx[12]);
    			add_location(input1, file$c, 135, 154, 7126);
    			attr_dev(div6, "class", "mb-3");
    			add_location(div6, file$c, 135, 60, 7032);
    			attr_dev(div7, "class", "col");
    			add_location(div7, file$c, 134, 56, 6953);
    			add_location(strong1, file$c, 138, 119, 7607);
    			attr_dev(label1, "class", "form-label");
    			attr_dev(label1, "for", "lastname");
    			add_location(label1, file$c, 138, 78, 7566);
    			attr_dev(input2, "class", "get-started-input-fields text-capitalize");
    			input2.disabled = /*borderlessInput*/ ctx[12];
    			attr_dev(input2, "type", "text");
    			attr_dev(input2, "id", "lastname");
    			attr_dev(input2, "placeholder", "Doe");
    			attr_dev(input2, "name", "lastname");
    			toggle_class(input2, "borderless-input", /*borderlessInput*/ ctx[12]);
    			add_location(input2, file$c, 138, 152, 7640);
    			attr_dev(div8, "class", "mb-3");
    			add_location(div8, file$c, 138, 60, 7548);
    			attr_dev(div9, "class", "col");
    			add_location(div9, file$c, 137, 56, 7469);
    			attr_dev(div10, "class", "row");
    			add_location(div10, file$c, 133, 52, 6878);
    			add_location(strong2, file$c, 143, 116, 8245);
    			attr_dev(label2, "class", "form-label");
    			attr_dev(label2, "for", "email");
    			add_location(label2, file$c, 143, 78, 8207);
    			attr_dev(input3, "class", "get-started-input-fields text-capitalize");
    			input3.disabled = /*borderlessInput*/ ctx[12];
    			attr_dev(input3, "type", "email");
    			attr_dev(input3, "id", "email");
    			attr_dev(input3, "placeholder", "example@email.com");
    			attr_dev(input3, "name", "email");
    			toggle_class(input3, "borderless-input", /*borderlessInput*/ ctx[12]);
    			add_location(input3, file$c, 143, 146, 8275);
    			attr_dev(div11, "class", "mb-3");
    			add_location(div11, file$c, 143, 60, 8189);
    			attr_dev(div12, "class", "col");
    			add_location(div12, file$c, 142, 56, 8110);
    			add_location(strong3, file$c, 146, 114, 8753);
    			attr_dev(label3, "class", "form-label");
    			attr_dev(label3, "for", "tel");
    			add_location(label3, file$c, 146, 78, 8717);
    			attr_dev(input4, "class", "get-started-input-fields text-capitalize");
    			input4.disabled = /*borderlessInput*/ ctx[12];
    			attr_dev(input4, "type", "text");
    			attr_dev(input4, "id", "tel");
    			attr_dev(input4, "placeholder", "");
    			attr_dev(input4, "name", "tel");
    			toggle_class(input4, "borderless-input", /*borderlessInput*/ ctx[12]);
    			add_location(input4, file$c, 146, 144, 8783);
    			attr_dev(div13, "class", "mb-3");
    			add_location(div13, file$c, 146, 60, 8699);
    			attr_dev(div14, "class", "col");
    			add_location(div14, file$c, 145, 56, 8620);
    			attr_dev(div15, "class", "row");
    			add_location(div15, file$c, 141, 52, 8035);
    			attr_dev(span1, "class", "spinner-grow spinner-grow-sm");
    			attr_dev(span1, "role", "status");
    			attr_dev(span1, "aria-hidden", "true");
    			add_location(span1, file$c, 151, 60, 9398);
    			attr_dev(button3, "class", "btn btn-primary btn-sm");
    			attr_dev(button3, "type", "submit");
    			add_location(button3, file$c, 150, 56, 9283);
    			attr_dev(div16, "class", "mb-3 mt-2");
    			toggle_class(div16, "hidden-display", /*borderlessInput*/ ctx[12]);
    			add_location(div16, file$c, 149, 52, 9163);
    			add_location(form1, file$c, 132, 48, 6818);
    			attr_dev(div17, "class", "card-body");
    			add_location(div17, file$c, 131, 44, 6745);
    			attr_dev(div18, "class", "card shadow mb-3 content-color");
    			add_location(div18, file$c, 124, 40, 6096);
    			attr_dev(p1, "class", "m-0 fw-bold");
    			add_location(p1, file$c, 159, 48, 10050);
    			attr_dev(button4, "class", "text-button d-none");
    			add_location(button4, file$c, 160, 48, 10142);
    			attr_dev(div19, "class", "card-header py-3 content-color d-flex justify-content-between align-items-center");
    			add_location(div19, file$c, 158, 44, 9906);
    			add_location(strong4, file$c, 166, 110, 10743);
    			attr_dev(label4, "class", "form-label");
    			attr_dev(label4, "for", "address");
    			add_location(label4, file$c, 166, 70, 10703);
    			attr_dev(input5, "class", "get-started-input-fields text-capitalize");
    			input5.disabled = /*borderlessInputContact*/ ctx[10];
    			attr_dev(input5, "type", "text");
    			attr_dev(input5, "id", "address");
    			attr_dev(input5, "placeholder", "");
    			attr_dev(input5, "name", "address");
    			toggle_class(input5, "borderless-input", /*borderlessInputContact*/ ctx[10]);
    			add_location(input5, file$c, 166, 142, 10775);
    			attr_dev(div20, "class", "mb-3");
    			add_location(div20, file$c, 166, 52, 10685);
    			add_location(strong5, file$c, 169, 115, 11263);
    			attr_dev(label5, "class", "form-label");
    			attr_dev(label5, "for", "city");
    			add_location(label5, file$c, 169, 78, 11226);
    			attr_dev(input6, "class", "get-started-input-fields text-capitalize");
    			input6.disabled = /*borderlessInputContact*/ ctx[10];
    			attr_dev(input6, "type", "text");
    			attr_dev(input6, "id", "city");
    			attr_dev(input6, "placeholder", "Los Angeles");
    			attr_dev(input6, "name", "city");
    			toggle_class(input6, "borderless-input", /*borderlessInputContact*/ ctx[10]);
    			add_location(input6, file$c, 169, 145, 11293);
    			attr_dev(div21, "class", "mb-3");
    			add_location(div21, file$c, 169, 60, 11208);
    			attr_dev(div22, "class", "col");
    			add_location(div22, file$c, 168, 56, 11129);
    			add_location(strong6, file$c, 172, 118, 11780);
    			attr_dev(label6, "class", "form-label");
    			attr_dev(label6, "for", "country");
    			add_location(label6, file$c, 172, 78, 11740);
    			attr_dev(input7, "class", "get-started-input-fields text-capitalize");
    			input7.disabled = /*borderlessInputContact*/ ctx[10];
    			attr_dev(input7, "type", "text");
    			attr_dev(input7, "id", "country");
    			attr_dev(input7, "placeholder", "USA");
    			attr_dev(input7, "name", "country");
    			toggle_class(input7, "borderless-input", /*borderlessInputContact*/ ctx[10]);
    			add_location(input7, file$c, 172, 150, 11812);
    			attr_dev(div23, "class", "mb-3");
    			add_location(div23, file$c, 172, 60, 11722);
    			attr_dev(div24, "class", "col");
    			add_location(div24, file$c, 171, 56, 11643);
    			attr_dev(div25, "class", "row");
    			add_location(div25, file$c, 167, 52, 11054);
    			attr_dev(button5, "class", "btn btn-primary btn-sm");
    			attr_dev(button5, "type", "submit");
    			add_location(button5, file$c, 175, 116, 12282);
    			attr_dev(div26, "class", "mb-3");
    			toggle_class(div26, "hidden-display", /*borderlessInputContact*/ ctx[10]);
    			add_location(div26, file$c, 175, 52, 12218);
    			add_location(form2, file$c, 165, 48, 10625);
    			attr_dev(div27, "class", "card-body");
    			add_location(div27, file$c, 164, 44, 10552);
    			attr_dev(div28, "class", "card shadow content-color");
    			add_location(div28, file$c, 157, 40, 9821);
    			attr_dev(div29, "class", "col");
    			add_location(div29, file$c, 123, 36, 6037);
    			attr_dev(div30, "class", "row");
    			add_location(div30, file$c, 122, 32, 5982);
    			attr_dev(div31, "class", "col-lg-8");
    			add_location(div31, file$c, 120, 28, 5855);
    			attr_dev(div32, "class", "row mb-3");
    			add_location(div32, file$c, 83, 24, 2905);
    			attr_dev(div33, "class", "container-fluid");
    			add_location(div33, file$c, 81, 20, 2784);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div33, anchor);
    			append_dev(div33, h3);
    			append_dev(div33, t1);
    			append_dev(div33, div32);
    			append_dev(div32, div4);
    			append_dev(div4, div3);
    			append_dev(div3, form0);
    			append_dev(form0, div2);
    			append_dev(div2, img);
    			/*img_binding*/ ctx[16](img);
    			append_dev(div2, t2);
    			append_dev(div2, input0);
    			append_dev(div2, t3);
    			append_dev(div2, div0);
    			append_dev(div0, button0);
    			append_dev(button0, span0);
    			append_dev(button0, t4);
    			append_dev(button0, t5);
    			append_dev(div2, t6);
    			append_dev(div2, div1);
    			append_dev(div1, button1);
    			/*form0_binding*/ ctx[19](form0);
    			append_dev(div32, t8);
    			append_dev(div32, div31);
    			append_dev(div31, div30);
    			append_dev(div30, div29);
    			append_dev(div29, div18);
    			append_dev(div18, div5);
    			append_dev(div5, p0);
    			append_dev(div5, t10);
    			append_dev(div5, button2);
    			append_dev(button2, t11);
    			append_dev(div18, t12);
    			append_dev(div18, div17);
    			append_dev(div17, form1);
    			append_dev(form1, div10);
    			append_dev(div10, div7);
    			append_dev(div7, div6);
    			append_dev(div6, label0);
    			append_dev(label0, strong0);
    			append_dev(div6, input1);
    			set_input_value(input1, /*data*/ ctx[4].firstname);
    			append_dev(div10, t14);
    			append_dev(div10, div9);
    			append_dev(div9, div8);
    			append_dev(div8, label1);
    			append_dev(label1, strong1);
    			append_dev(div8, input2);
    			set_input_value(input2, /*data*/ ctx[4].lastname);
    			append_dev(form1, t16);
    			append_dev(form1, div15);
    			append_dev(div15, div12);
    			append_dev(div12, div11);
    			append_dev(div11, label2);
    			append_dev(label2, strong2);
    			append_dev(div11, input3);
    			set_input_value(input3, /*data*/ ctx[4].email);
    			append_dev(div15, t18);
    			append_dev(div15, div14);
    			append_dev(div14, div13);
    			append_dev(div13, label3);
    			append_dev(label3, strong3);
    			append_dev(div13, input4);
    			set_input_value(input4, /*data*/ ctx[4].mobile);
    			append_dev(form1, t20);
    			append_dev(form1, div16);
    			append_dev(div16, button3);
    			append_dev(button3, span1);
    			append_dev(button3, t21);
    			append_dev(div29, t22);
    			append_dev(div29, div28);
    			append_dev(div28, div19);
    			append_dev(div19, p1);
    			append_dev(div19, t24);
    			append_dev(div19, button4);
    			append_dev(button4, t25);
    			append_dev(div28, t26);
    			append_dev(div28, div27);
    			append_dev(div27, form2);
    			append_dev(form2, div20);
    			append_dev(div20, label4);
    			append_dev(label4, strong4);
    			append_dev(div20, input5);
    			set_input_value(input5, /*data*/ ctx[4].address);
    			append_dev(form2, t28);
    			append_dev(form2, div25);
    			append_dev(div25, div22);
    			append_dev(div22, div21);
    			append_dev(div21, label5);
    			append_dev(label5, strong5);
    			append_dev(div21, input6);
    			set_input_value(input6, /*data*/ ctx[4].state);
    			append_dev(div25, t30);
    			append_dev(div25, div24);
    			append_dev(div24, div23);
    			append_dev(div23, label6);
    			append_dev(label6, strong6);
    			append_dev(div23, input7);
    			set_input_value(input7, /*data*/ ctx[4].country);
    			append_dev(form2, t32);
    			append_dev(form2, div26);
    			append_dev(div26, button5);

    			if (!mounted) {
    				dispose = [
    					listen_dev(input0, "change", /*change_handler*/ ctx[17], false, false, false, false),
    					listen_dev(button0, "click", /*submitNewProfilePicture*/ ctx[14], false, false, false, false),
    					listen_dev(button1, "click", /*click_handler*/ ctx[18], false, false, false, false),
    					listen_dev(form0, "submit", prevent_default(/*submit_handler*/ ctx[15]), false, true, false, false),
    					listen_dev(form0, "reset", prevent_default(/*reset_handler*/ ctx[20]), false, true, false, false),
    					listen_dev(button2, "click", /*click_handler_1*/ ctx[21], false, false, false, false),
    					listen_dev(input1, "input", /*input1_input_handler*/ ctx[22]),
    					listen_dev(input2, "input", /*input2_input_handler*/ ctx[23]),
    					listen_dev(input3, "input", /*input3_input_handler*/ ctx[24]),
    					listen_dev(input4, "input", /*input4_input_handler*/ ctx[25]),
    					listen_dev(button4, "click", /*click_handler_2*/ ctx[26], false, false, false, false),
    					listen_dev(input5, "input", /*input5_input_handler*/ ctx[27]),
    					listen_dev(input6, "input", /*input6_input_handler*/ ctx[28]),
    					listen_dev(input7, "input", /*input7_input_handler*/ ctx[29])
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*data*/ 16 && !src_url_equal(img.src, img_src_value = /*data*/ ctx[4].picture)) {
    				attr_dev(img, "src", img_src_value);
    			}

    			if (dirty & /*isSubmittingProfilePhoto*/ 32) {
    				toggle_class(span0, "d-none", !/*isSubmittingProfilePhoto*/ ctx[5]);
    			}

    			if (dirty & /*changePhotoButtonText*/ 256) set_data_dev(t5, /*changePhotoButtonText*/ ctx[8]);

    			if (dirty & /*isSubmittingProfilePhoto*/ 32) {
    				prop_dev(button0, "disabled", /*isSubmittingProfilePhoto*/ ctx[5]);
    			}

    			if (dirty & /*isSubmitable*/ 2) {
    				toggle_class(div1, "d-none", !/*isSubmitable*/ ctx[1]);
    			}

    			if (dirty & /*editBasicContactTitle*/ 2048) set_data_dev(t11, /*editBasicContactTitle*/ ctx[11]);

    			if (dirty & /*borderlessInput*/ 4096) {
    				prop_dev(input1, "disabled", /*borderlessInput*/ ctx[12]);
    			}

    			if (dirty & /*data*/ 16 && input1.value !== /*data*/ ctx[4].firstname) {
    				set_input_value(input1, /*data*/ ctx[4].firstname);
    			}

    			if (dirty & /*borderlessInput*/ 4096) {
    				toggle_class(input1, "borderless-input", /*borderlessInput*/ ctx[12]);
    			}

    			if (dirty & /*borderlessInput*/ 4096) {
    				prop_dev(input2, "disabled", /*borderlessInput*/ ctx[12]);
    			}

    			if (dirty & /*data*/ 16 && input2.value !== /*data*/ ctx[4].lastname) {
    				set_input_value(input2, /*data*/ ctx[4].lastname);
    			}

    			if (dirty & /*borderlessInput*/ 4096) {
    				toggle_class(input2, "borderless-input", /*borderlessInput*/ ctx[12]);
    			}

    			if (dirty & /*borderlessInput*/ 4096) {
    				prop_dev(input3, "disabled", /*borderlessInput*/ ctx[12]);
    			}

    			if (dirty & /*data*/ 16 && input3.value !== /*data*/ ctx[4].email) {
    				set_input_value(input3, /*data*/ ctx[4].email);
    			}

    			if (dirty & /*borderlessInput*/ 4096) {
    				toggle_class(input3, "borderless-input", /*borderlessInput*/ ctx[12]);
    			}

    			if (dirty & /*borderlessInput*/ 4096) {
    				prop_dev(input4, "disabled", /*borderlessInput*/ ctx[12]);
    			}

    			if (dirty & /*data*/ 16 && input4.value !== /*data*/ ctx[4].mobile) {
    				set_input_value(input4, /*data*/ ctx[4].mobile);
    			}

    			if (dirty & /*borderlessInput*/ 4096) {
    				toggle_class(input4, "borderless-input", /*borderlessInput*/ ctx[12]);
    			}

    			if (dirty & /*borderlessInput*/ 4096) {
    				toggle_class(div16, "hidden-display", /*borderlessInput*/ ctx[12]);
    			}

    			if (dirty & /*editContactDetailsTitle*/ 512) set_data_dev(t25, /*editContactDetailsTitle*/ ctx[9]);

    			if (dirty & /*borderlessInputContact*/ 1024) {
    				prop_dev(input5, "disabled", /*borderlessInputContact*/ ctx[10]);
    			}

    			if (dirty & /*data*/ 16 && input5.value !== /*data*/ ctx[4].address) {
    				set_input_value(input5, /*data*/ ctx[4].address);
    			}

    			if (dirty & /*borderlessInputContact*/ 1024) {
    				toggle_class(input5, "borderless-input", /*borderlessInputContact*/ ctx[10]);
    			}

    			if (dirty & /*borderlessInputContact*/ 1024) {
    				prop_dev(input6, "disabled", /*borderlessInputContact*/ ctx[10]);
    			}

    			if (dirty & /*data*/ 16 && input6.value !== /*data*/ ctx[4].state) {
    				set_input_value(input6, /*data*/ ctx[4].state);
    			}

    			if (dirty & /*borderlessInputContact*/ 1024) {
    				toggle_class(input6, "borderless-input", /*borderlessInputContact*/ ctx[10]);
    			}

    			if (dirty & /*borderlessInputContact*/ 1024) {
    				prop_dev(input7, "disabled", /*borderlessInputContact*/ ctx[10]);
    			}

    			if (dirty & /*data*/ 16 && input7.value !== /*data*/ ctx[4].country) {
    				set_input_value(input7, /*data*/ ctx[4].country);
    			}

    			if (dirty & /*borderlessInputContact*/ 1024) {
    				toggle_class(input7, "borderless-input", /*borderlessInputContact*/ ctx[10]);
    			}

    			if (dirty & /*borderlessInputContact*/ 1024) {
    				toggle_class(div26, "hidden-display", /*borderlessInputContact*/ ctx[10]);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div33);
    			/*img_binding*/ ctx[16](null);
    			/*form0_binding*/ ctx[19](null);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$6.name,
    		type: "if",
    		source: "(81:16) {#if state === NetworkStates.loaded}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$c(ctx) {
    	let div2;
    	let navigator;
    	let t0;
    	let div1;
    	let div0;
    	let header;
    	let t1;
    	let current_block_type_index;
    	let if_block;
    	let t2;
    	let footer;
    	let current;

    	navigator = new DashboardNavigator({
    			props: { active: "profile" },
    			$$inline: true
    		});

    	header = new DashboardHeader({ $$inline: true });
    	const if_block_creators = [create_if_block$6, create_if_block_1$6, create_else_block$6];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*state*/ ctx[2] === NetworkStates.loaded) return 0;
    		if (/*state*/ ctx[2] == NetworkStates.loading) return 1;
    		return 2;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    	footer = new DashboardFooter({ $$inline: true });

    	const block = {
    		c: function create() {
    			div2 = element("div");
    			create_component(navigator.$$.fragment);
    			t0 = space();
    			div1 = element("div");
    			div0 = element("div");
    			create_component(header.$$.fragment);
    			t1 = space();
    			if_block.c();
    			t2 = space();
    			create_component(footer.$$.fragment);
    			attr_dev(div0, "id", "content");
    			attr_dev(div0, "class", "background-color");
    			add_location(div0, file$c, 77, 12, 2599);
    			attr_dev(div1, "class", "d-flex flex-column");
    			attr_dev(div1, "id", "content-wrapper");
    			add_location(div1, file$c, 76, 8, 2532);
    			attr_dev(div2, "id", "wrapper");
    			add_location(div2, file$c, 73, 0, 2432);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div2, anchor);
    			mount_component(navigator, div2, null);
    			append_dev(div2, t0);
    			append_dev(div2, div1);
    			append_dev(div1, div0);
    			mount_component(header, div0, null);
    			append_dev(div0, t1);
    			if_blocks[current_block_type_index].m(div0, null);
    			append_dev(div1, t2);
    			mount_component(footer, div1, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				} else {
    					if_block.p(ctx, dirty);
    				}

    				transition_in(if_block, 1);
    				if_block.m(div0, null);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(navigator.$$.fragment, local);
    			transition_in(header.$$.fragment, local);
    			transition_in(if_block);
    			transition_in(footer.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(navigator.$$.fragment, local);
    			transition_out(header.$$.fragment, local);
    			transition_out(if_block);
    			transition_out(footer.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div2);
    			destroy_component(navigator);
    			destroy_component(header);
    			if_blocks[current_block_type_index].d();
    			destroy_component(footer);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$c.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$c($$self, $$props, $$invalidate) {
    	let borderlessInput;
    	let editBasicContactTitle;
    	let borderlessInputContact;
    	let editContactDetailsTitle;
    	let changePhotoButtonText;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Profile', slots, []);
    	let state;
    	let errorMessage;

    	let data = {
    		firstname: "",
    		lastname: "",
    		email: "",
    		mobile: "",
    		address: "",
    		state: "",
    		picture: "/assets/img/pictures/default.png",
    		country: ""
    	};

    	let editBasicContact = false;
    	let editContactDetails = false;
    	let isSubmittingProfilePhoto = false;
    	let imageForm;
    	let imageHolder;
    	let isSubmitable = false;

    	const fetchData = async () => {
    		$$invalidate(2, state = NetworkStates.loading);
    		let result = await fetchAndSendDataWithJson("/profile");

    		if (result.status) {
    			$$invalidate(2, state = NetworkStates.loaded);
    			$$invalidate(4, data = result.data);
    		} else {
    			$$invalidate(2, state = NetworkStates.error);
    			$$invalidate(3, errorMessage = result.message);
    		}
    	};

    	const submitNewProfilePicture = async evt => {
    		if (changePhotoButtonText.includes("Confirm")) {
    			$$invalidate(1, isSubmitable = false);
    			$$invalidate(5, isSubmittingProfilePhoto = true);
    			let result = await sendDataAndFile("/profile-picture", imageForm);
    			$$invalidate(5, isSubmittingProfilePhoto = false);

    			if (!result.status) {
    				alertUser("Unable to update picture at this time", result.message, "error");
    			} else {
    				// window.location.reload()
    				$$invalidate(7, imageHolder.src = result.data.picture, imageHolder);
    			}
    		} else {
    			imageForm.file.click();
    		}
    	};

    	onMount(() => {
    		fetchData();
    	});

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Profile> was created with unknown prop '${key}'`);
    	});

    	function submit_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function img_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			imageHolder = $$value;
    			$$invalidate(7, imageHolder);
    		});
    	}

    	const change_handler = evt => {
    		const file = evt.target.files[0];

    		if (fileTypes.includes(file.type)) {
    			$$invalidate(7, imageHolder.src = URL.createObjectURL(file), imageHolder);
    			$$invalidate(1, isSubmitable = true);
    		} else {
    			evt.target.value = null;
    			$$invalidate(1, isSubmitable = false);
    			$$invalidate(7, imageHolder.src = data.picture, imageHolder);
    			alertUser("File Format", "Invalid Image Format", "error");
    		}
    	};

    	const click_handler = () => {
    		imageForm.reset();
    	};

    	function form0_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			imageForm = $$value;
    			$$invalidate(6, imageForm);
    		});
    	}

    	const reset_handler = () => {
    		$$invalidate(7, imageHolder.src = data.picture, imageHolder);
    		$$invalidate(1, isSubmitable = false);
    	};

    	const click_handler_1 = () => {
    		$$invalidate(0, editBasicContact = !editBasicContact);
    	};

    	function input1_input_handler() {
    		data.firstname = this.value;
    		$$invalidate(4, data);
    	}

    	function input2_input_handler() {
    		data.lastname = this.value;
    		$$invalidate(4, data);
    	}

    	function input3_input_handler() {
    		data.email = this.value;
    		$$invalidate(4, data);
    	}

    	function input4_input_handler() {
    		data.mobile = this.value;
    		$$invalidate(4, data);
    	}

    	const click_handler_2 = () => {
    		/*editContactDetails = !editContactDetails */ alertUser("", "To update contact details, please reach out to support.");
    	};

    	function input5_input_handler() {
    		data.address = this.value;
    		$$invalidate(4, data);
    	}

    	function input6_input_handler() {
    		data.state = this.value;
    		$$invalidate(4, data);
    	}

    	function input7_input_handler() {
    		data.country = this.value;
    		$$invalidate(4, data);
    	}

    	$$self.$capture_state = () => ({
    		Footer: DashboardFooter,
    		Navigator: DashboardNavigator,
    		Header: DashboardHeader,
    		Spinkit,
    		LoadingError,
    		alertUser,
    		NetworkStates,
    		fetchAndSendDataWithJson,
    		sendDataAndFile,
    		fileTypes,
    		onMount,
    		state,
    		errorMessage,
    		data,
    		editBasicContact,
    		editContactDetails,
    		isSubmittingProfilePhoto,
    		imageForm,
    		imageHolder,
    		isSubmitable,
    		fetchData,
    		submitNewProfilePicture,
    		changePhotoButtonText,
    		editContactDetailsTitle,
    		borderlessInputContact,
    		editBasicContactTitle,
    		borderlessInput
    	});

    	$$self.$inject_state = $$props => {
    		if ('state' in $$props) $$invalidate(2, state = $$props.state);
    		if ('errorMessage' in $$props) $$invalidate(3, errorMessage = $$props.errorMessage);
    		if ('data' in $$props) $$invalidate(4, data = $$props.data);
    		if ('editBasicContact' in $$props) $$invalidate(0, editBasicContact = $$props.editBasicContact);
    		if ('editContactDetails' in $$props) $$invalidate(30, editContactDetails = $$props.editContactDetails);
    		if ('isSubmittingProfilePhoto' in $$props) $$invalidate(5, isSubmittingProfilePhoto = $$props.isSubmittingProfilePhoto);
    		if ('imageForm' in $$props) $$invalidate(6, imageForm = $$props.imageForm);
    		if ('imageHolder' in $$props) $$invalidate(7, imageHolder = $$props.imageHolder);
    		if ('isSubmitable' in $$props) $$invalidate(1, isSubmitable = $$props.isSubmitable);
    		if ('changePhotoButtonText' in $$props) $$invalidate(8, changePhotoButtonText = $$props.changePhotoButtonText);
    		if ('editContactDetailsTitle' in $$props) $$invalidate(9, editContactDetailsTitle = $$props.editContactDetailsTitle);
    		if ('borderlessInputContact' in $$props) $$invalidate(10, borderlessInputContact = $$props.borderlessInputContact);
    		if ('editBasicContactTitle' in $$props) $$invalidate(11, editBasicContactTitle = $$props.editBasicContactTitle);
    		if ('borderlessInput' in $$props) $$invalidate(12, borderlessInput = $$props.borderlessInput);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*editBasicContact*/ 1) {
    			$$invalidate(12, borderlessInput = editBasicContact == false);
    		}

    		if ($$self.$$.dirty & /*editBasicContact*/ 1) {
    			$$invalidate(11, editBasicContactTitle = editBasicContact ? "Cancel" : "Edit");
    		}

    		if ($$self.$$.dirty & /*isSubmitable*/ 2) {
    			$$invalidate(8, changePhotoButtonText = isSubmitable ? "Confirm" : "Change Photo");
    		}
    	};

    	$$invalidate(10, borderlessInputContact = editContactDetails == false);
    	$$invalidate(9, editContactDetailsTitle = editContactDetails ? "Cancel" : "Edit");

    	return [
    		editBasicContact,
    		isSubmitable,
    		state,
    		errorMessage,
    		data,
    		isSubmittingProfilePhoto,
    		imageForm,
    		imageHolder,
    		changePhotoButtonText,
    		editContactDetailsTitle,
    		borderlessInputContact,
    		editBasicContactTitle,
    		borderlessInput,
    		fetchData,
    		submitNewProfilePicture,
    		submit_handler,
    		img_binding,
    		change_handler,
    		click_handler,
    		form0_binding,
    		reset_handler,
    		click_handler_1,
    		input1_input_handler,
    		input2_input_handler,
    		input3_input_handler,
    		input4_input_handler,
    		click_handler_2,
    		input5_input_handler,
    		input6_input_handler,
    		input7_input_handler
    	];
    }

    class Profile extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$c, create_fragment$c, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Profile",
    			options,
    			id: create_fragment$c.name
    		});
    	}
    }

    /* src\components\HorizontalLoader.svelte generated by Svelte v3.59.2 */

    const file$b = "src\\components\\HorizontalLoader.svelte";

    function create_fragment$b(ctx) {
    	let div4;
    	let div3;
    	let div0;
    	let t0;
    	let div1;
    	let t1;
    	let div2;

    	const block = {
    		c: function create() {
    			div4 = element("div");
    			div3 = element("div");
    			div0 = element("div");
    			t0 = space();
    			div1 = element("div");
    			t1 = space();
    			div2 = element("div");
    			attr_dev(div0, "class", "bounce1 svelte-d2ovad");
    			add_location(div0, file$b, 2, 8, 110);
    			attr_dev(div1, "class", "bounce2 svelte-d2ovad");
    			add_location(div1, file$b, 3, 8, 147);
    			attr_dev(div2, "class", "bounce3 svelte-d2ovad");
    			add_location(div2, file$b, 4, 8, 184);
    			attr_dev(div3, "class", "spinner svelte-d2ovad");
    			add_location(div3, file$b, 1, 4, 79);
    			attr_dev(div4, "class", "w-100 d-flex justify-content-center align-items-center py-3");
    			add_location(div4, file$b, 0, 0, 0);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div4, anchor);
    			append_dev(div4, div3);
    			append_dev(div3, div0);
    			append_dev(div3, t0);
    			append_dev(div3, div1);
    			append_dev(div3, t1);
    			append_dev(div3, div2);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div4);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$b.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$b($$self, $$props) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('HorizontalLoader', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<HorizontalLoader> was created with unknown prop '${key}'`);
    	});

    	return [];
    }

    class HorizontalLoader extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$b, create_fragment$b, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "HorizontalLoader",
    			options,
    			id: create_fragment$b.name
    		});
    	}
    }

    /* src\pages\dashboard\Transactions.svelte generated by Svelte v3.59.2 */

    const file$a = "src\\pages\\dashboard\\Transactions.svelte";

    function get_each_context$2(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[14] = list[i];
    	return child_ctx;
    }

    function get_each_context_1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[17] = list[i];
    	child_ctx[19] = i;
    	return child_ctx;
    }

    // (74:24) {:else}
    function create_else_block$5(ctx) {
    	let div;
    	let table;
    	let thead;
    	let tr;
    	let th0;
    	let t1;
    	let th1;
    	let t3;
    	let th2;
    	let t5;
    	let th3;
    	let t7;
    	let th4;
    	let t9;
    	let tbody;
    	let each_value_1 = /*transactions*/ ctx[4];
    	validate_each_argument(each_value_1);
    	let each_blocks = [];

    	for (let i = 0; i < each_value_1.length; i += 1) {
    		each_blocks[i] = create_each_block_1(get_each_context_1(ctx, each_value_1, i));
    	}

    	let each_1_else = null;

    	if (!each_value_1.length) {
    		each_1_else = create_else_block_1$1(ctx);
    	}

    	const block = {
    		c: function create() {
    			div = element("div");
    			table = element("table");
    			thead = element("thead");
    			tr = element("tr");
    			th0 = element("th");
    			th0.textContent = "S/N";
    			t1 = space();
    			th1 = element("th");
    			th1.textContent = "Status";
    			t3 = space();
    			th2 = element("th");
    			th2.textContent = "Amount";
    			t5 = space();
    			th3 = element("th");
    			th3.textContent = "Timestamp";
    			t7 = space();
    			th4 = element("th");
    			th4.textContent = "Description";
    			t9 = space();
    			tbody = element("tbody");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			if (each_1_else) {
    				each_1_else.c();
    			}

    			attr_dev(th0, "class", "text-center");
    			add_location(th0, file$a, 78, 44, 4100);
    			attr_dev(th1, "class", "text-center");
    			add_location(th1, file$a, 79, 44, 4178);
    			attr_dev(th2, "class", "text-center");
    			add_location(th2, file$a, 80, 44, 4259);
    			attr_dev(th3, "class", "text-center");
    			add_location(th3, file$a, 81, 44, 4340);
    			attr_dev(th4, "class", "text-center");
    			add_location(th4, file$a, 82, 44, 4424);
    			add_location(tr, file$a, 77, 40, 4050);
    			add_location(thead, file$a, 76, 36, 4001);
    			add_location(tbody, file$a, 85, 36, 4595);
    			attr_dev(table, "class", "table my-0");
    			attr_dev(table, "id", "dataTable");
    			add_location(table, file$a, 75, 32, 3922);
    			attr_dev(div, "class", "table-responsive table mt-2");
    			attr_dev(div, "id", "dataTable");
    			attr_dev(div, "role", "grid");
    			attr_dev(div, "aria-describedby", "dataTable_info");
    			add_location(div, file$a, 74, 28, 3786);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, table);
    			append_dev(table, thead);
    			append_dev(thead, tr);
    			append_dev(tr, th0);
    			append_dev(tr, t1);
    			append_dev(tr, th1);
    			append_dev(tr, t3);
    			append_dev(tr, th2);
    			append_dev(tr, t5);
    			append_dev(tr, th3);
    			append_dev(tr, t7);
    			append_dev(tr, th4);
    			append_dev(table, t9);
    			append_dev(table, tbody);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				if (each_blocks[i]) {
    					each_blocks[i].m(tbody, null);
    				}
    			}

    			if (each_1_else) {
    				each_1_else.m(tbody, null);
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*transactions, formatUTCDate, actualCurrency, $basicDetails, page, limit*/ 147) {
    				each_value_1 = /*transactions*/ ctx[4];
    				validate_each_argument(each_value_1);
    				let i;

    				for (i = 0; i < each_value_1.length; i += 1) {
    					const child_ctx = get_each_context_1(ctx, each_value_1, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block_1(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(tbody, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value_1.length;

    				if (!each_value_1.length && each_1_else) {
    					each_1_else.p(ctx, dirty);
    				} else if (!each_value_1.length) {
    					each_1_else = create_else_block_1$1(ctx);
    					each_1_else.c();
    					each_1_else.m(tbody, null);
    				} else if (each_1_else) {
    					each_1_else.d(1);
    					each_1_else = null;
    				}
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_each(each_blocks, detaching);
    			if (each_1_else) each_1_else.d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$5.name,
    		type: "else",
    		source: "(74:24) {:else}",
    		ctx
    	});

    	return block;
    }

    // (70:64) 
    function create_if_block_1$5(ctx) {
    	let div;
    	let span;

    	const block = {
    		c: function create() {
    			div = element("div");
    			span = element("span");
    			span.textContent = "Unable to load data";
    			add_location(span, file$a, 71, 32, 3655);
    			attr_dev(div, "class", "d-flex w-100 justify-content-center align-items-center py-3");
    			set_style(div, "color", "var(--semi-white)");
    			set_style(div, "font-style", "italic");
    			set_style(div, "font-size", "larger");
    			add_location(div, file$a, 70, 28, 3475);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, span);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$5.name,
    		type: "if",
    		source: "(70:64) ",
    		ctx
    	});

    	return block;
    }

    // (68:24) {#if state === NetworkStates.loading}
    function create_if_block$5(ctx) {
    	let horizontalloader;
    	let current;
    	horizontalloader = new HorizontalLoader({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(horizontalloader.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(horizontalloader, target, anchor);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(horizontalloader.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(horizontalloader.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(horizontalloader, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$5.name,
    		type: "if",
    		source: "(68:24) {#if state === NetworkStates.loading}",
    		ctx
    	});

    	return block;
    }

    // (95:40) {:else}
    function create_else_block_1$1(ctx) {
    	let tr;
    	let td;
    	let t1;

    	const block = {
    		c: function create() {
    			tr = element("tr");
    			td = element("td");
    			td.textContent = "No transactions yet";
    			t1 = space();
    			set_style(td, "font-size", "large");
    			set_style(td, "font-style", "italic");
    			add_location(td, file$a, 96, 48, 5691);
    			add_location(tr, file$a, 95, 44, 5637);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, tr, anchor);
    			append_dev(tr, td);
    			append_dev(tr, t1);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(tr);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block_1$1.name,
    		type: "else",
    		source: "(95:40) {:else}",
    		ctx
    	});

    	return block;
    }

    // (87:40) {#each transactions as transaction, index}
    function create_each_block_1(ctx) {
    	let tr;
    	let td0;
    	let t0_value = (/*page*/ ctx[0] - 1) * /*limit*/ ctx[1] + (/*index*/ ctx[19] + 1) + "";
    	let t0;
    	let t1;
    	let td1;
    	let t2_value = /*transaction*/ ctx[17].status + "";
    	let t2;
    	let t3;
    	let td2;
    	let t4_value = actualCurrency(/*$basicDetails*/ ctx[7].currency) + "";
    	let t4;
    	let t5_value = /*transaction*/ ctx[17].amount + "";
    	let t5;
    	let t6;
    	let td3;
    	let t7_value = formatUTCDate(/*transaction*/ ctx[17].date) + "";
    	let t7;
    	let t8;
    	let td4;
    	let t9_value = /*transaction*/ ctx[17].description + "";
    	let t9;
    	let t10;

    	const block = {
    		c: function create() {
    			tr = element("tr");
    			td0 = element("td");
    			t0 = text(t0_value);
    			t1 = space();
    			td1 = element("td");
    			t2 = text(t2_value);
    			t3 = space();
    			td2 = element("td");
    			t4 = text(t4_value);
    			t5 = text(t5_value);
    			t6 = space();
    			td3 = element("td");
    			t7 = text(t7_value);
    			t8 = space();
    			td4 = element("td");
    			t9 = text(t9_value);
    			t10 = space();
    			attr_dev(td0, "class", "text-center");
    			add_location(td0, file$a, 88, 48, 4786);
    			attr_dev(td1, "class", "text-capitalize text-left");
    			toggle_class(td1, "text-style-info", /*transaction*/ ctx[17].status === "pending");
    			toggle_class(td1, "text-error", /*transaction*/ ctx[17].status === "failed");
    			toggle_class(td1, "text-success", /*transaction*/ ctx[17].status === "success");
    			add_location(td1, file$a, 89, 48, 4901);
    			attr_dev(td2, "class", "text-left");
    			add_location(td2, file$a, 90, 48, 5176);
    			attr_dev(td3, "class", "text-left");
    			add_location(td3, file$a, 91, 48, 5313);
    			attr_dev(td4, "class", "text-capitalize text-left");
    			add_location(td4, file$a, 92, 48, 5423);
    			add_location(tr, file$a, 87, 44, 4732);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, tr, anchor);
    			append_dev(tr, td0);
    			append_dev(td0, t0);
    			append_dev(tr, t1);
    			append_dev(tr, td1);
    			append_dev(td1, t2);
    			append_dev(tr, t3);
    			append_dev(tr, td2);
    			append_dev(td2, t4);
    			append_dev(td2, t5);
    			append_dev(tr, t6);
    			append_dev(tr, td3);
    			append_dev(td3, t7);
    			append_dev(tr, t8);
    			append_dev(tr, td4);
    			append_dev(td4, t9);
    			append_dev(tr, t10);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*page, limit*/ 3 && t0_value !== (t0_value = (/*page*/ ctx[0] - 1) * /*limit*/ ctx[1] + (/*index*/ ctx[19] + 1) + "")) set_data_dev(t0, t0_value);
    			if (dirty & /*transactions*/ 16 && t2_value !== (t2_value = /*transaction*/ ctx[17].status + "")) set_data_dev(t2, t2_value);

    			if (dirty & /*transactions*/ 16) {
    				toggle_class(td1, "text-style-info", /*transaction*/ ctx[17].status === "pending");
    			}

    			if (dirty & /*transactions*/ 16) {
    				toggle_class(td1, "text-error", /*transaction*/ ctx[17].status === "failed");
    			}

    			if (dirty & /*transactions*/ 16) {
    				toggle_class(td1, "text-success", /*transaction*/ ctx[17].status === "success");
    			}

    			if (dirty & /*$basicDetails*/ 128 && t4_value !== (t4_value = actualCurrency(/*$basicDetails*/ ctx[7].currency) + "")) set_data_dev(t4, t4_value);
    			if (dirty & /*transactions*/ 16 && t5_value !== (t5_value = /*transaction*/ ctx[17].amount + "")) set_data_dev(t5, t5_value);
    			if (dirty & /*transactions*/ 16 && t7_value !== (t7_value = formatUTCDate(/*transaction*/ ctx[17].date) + "")) set_data_dev(t7, t7_value);
    			if (dirty & /*transactions*/ 16 && t9_value !== (t9_value = /*transaction*/ ctx[17].description + "")) set_data_dev(t9, t9_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(tr);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_1.name,
    		type: "each",
    		source: "(87:40) {#each transactions as transaction, index}",
    		ctx
    	});

    	return block;
    }

    // (112:40) {#each pagesRange as pageNumber}
    function create_each_block$2(ctx) {
    	let li;
    	let a;
    	let t_value = /*pageNumber*/ ctx[14] + "";
    	let t;
    	let mounted;
    	let dispose;

    	function click_handler_1() {
    		return /*click_handler_1*/ ctx[11](/*pageNumber*/ ctx[14]);
    	}

    	const block = {
    		c: function create() {
    			li = element("li");
    			a = element("a");
    			t = text(t_value);
    			attr_dev(a, "class", "page-link");
    			attr_dev(a, "href", "");
    			add_location(a, file$a, 112, 103, 6954);
    			attr_dev(li, "class", "page-item");
    			toggle_class(li, "active", /*page*/ ctx[0] === /*pageNumber*/ ctx[14]);
    			add_location(li, file$a, 112, 44, 6895);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, li, anchor);
    			append_dev(li, a);
    			append_dev(a, t);

    			if (!mounted) {
    				dispose = listen_dev(a, "click", click_handler_1, false, false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			if (dirty & /*pagesRange*/ 64 && t_value !== (t_value = /*pageNumber*/ ctx[14] + "")) set_data_dev(t, t_value);

    			if (dirty & /*page, pagesRange*/ 65) {
    				toggle_class(li, "active", /*page*/ ctx[0] === /*pageNumber*/ ctx[14]);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(li);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$2.name,
    		type: "each",
    		source: "(112:40) {#each pagesRange as pageNumber}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$a(ctx) {
    	let div12;
    	let navigator;
    	let t0;
    	let div11;
    	let div10;
    	let header;
    	let t1;
    	let div9;
    	let h3;
    	let t3;
    	let div8;
    	let div0;
    	let p0;
    	let t5;
    	let div7;
    	let div3;
    	let div2;
    	let div1;
    	let label;
    	let t6;
    	let select;
    	let option0;
    	let option1;
    	let option2;
    	let option3;
    	let t11;
    	let t12;
    	let current_block_type_index;
    	let if_block;
    	let t13;
    	let div6;
    	let div4;
    	let p1;
    	let t14;
    	let t15;
    	let div5;
    	let nav;
    	let ul;
    	let li0;
    	let a0;
    	let span0;
    	let t17;
    	let t18;
    	let li1;
    	let a1;
    	let span1;
    	let t20;
    	let footer;
    	let current;
    	let mounted;
    	let dispose;

    	navigator = new DashboardNavigator({
    			props: { active: "transactions" },
    			$$inline: true
    		});

    	header = new DashboardHeader({ $$inline: true });
    	const if_block_creators = [create_if_block$5, create_if_block_1$5, create_else_block$5];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*state*/ ctx[3] === NetworkStates.loading) return 0;
    		if (/*state*/ ctx[3] === NetworkStates.error) return 1;
    		return 2;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    	let each_value = /*pagesRange*/ ctx[6];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$2(get_each_context$2(ctx, each_value, i));
    	}

    	footer = new DashboardFooter({ $$inline: true });

    	const block = {
    		c: function create() {
    			div12 = element("div");
    			create_component(navigator.$$.fragment);
    			t0 = space();
    			div11 = element("div");
    			div10 = element("div");
    			create_component(header.$$.fragment);
    			t1 = space();
    			div9 = element("div");
    			h3 = element("h3");
    			h3.textContent = "Transactions";
    			t3 = space();
    			div8 = element("div");
    			div0 = element("div");
    			p0 = element("p");
    			p0.textContent = "History";
    			t5 = space();
    			div7 = element("div");
    			div3 = element("div");
    			div2 = element("div");
    			div1 = element("div");
    			label = element("label");
    			t6 = text("Show ");
    			select = element("select");
    			option0 = element("option");
    			option0.textContent = "10";
    			option1 = element("option");
    			option1.textContent = "20";
    			option2 = element("option");
    			option2.textContent = "30";
    			option3 = element("option");
    			option3.textContent = "50";
    			t11 = text(" ");
    			t12 = space();
    			if_block.c();
    			t13 = space();
    			div6 = element("div");
    			div4 = element("div");
    			p1 = element("p");
    			t14 = text(/*displayResultsText*/ ctx[5]);
    			t15 = space();
    			div5 = element("div");
    			nav = element("nav");
    			ul = element("ul");
    			li0 = element("li");
    			a0 = element("a");
    			span0 = element("span");
    			span0.textContent = "«";
    			t17 = space();

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t18 = space();
    			li1 = element("li");
    			a1 = element("a");
    			span1 = element("span");
    			span1.textContent = "»";
    			t20 = space();
    			create_component(footer.$$.fragment);
    			attr_dev(h3, "class", "mb-4 text-white");
    			add_location(h3, file$a, 46, 16, 1776);
    			attr_dev(p0, "class", "m-0 fw-bold");
    			add_location(p0, file$a, 49, 24, 1956);
    			attr_dev(div0, "class", "card-header py-3 content-color");
    			add_location(div0, file$a, 48, 20, 1886);
    			option0.__value = "10";
    			option0.value = option0.__value;
    			add_location(option0, file$a, 56, 44, 2494);
    			option1.__value = "20";
    			option1.value = option1.__value;
    			add_location(option1, file$a, 57, 44, 2570);
    			option2.__value = "30";
    			option2.value = option2.__value;
    			add_location(option2, file$a, 58, 44, 2646);
    			option3.__value = "50";
    			option3.value = option3.__value;
    			add_location(option3, file$a, 59, 44, 2722);
    			attr_dev(select, "class", "d-inline-block form-select form-select-sm");
    			if (/*limit*/ ctx[1] === void 0) add_render_callback(() => /*select_change_handler*/ ctx[9].call(select));
    			add_location(select, file$a, 55, 72, 2371);
    			attr_dev(label, "class", "form-label");
    			add_location(label, file$a, 55, 36, 2335);
    			attr_dev(div1, "id", "dataTable_length");
    			attr_dev(div1, "class", "dataTables_length");
    			attr_dev(div1, "aria-controls", "dataTable");
    			add_location(div1, file$a, 54, 32, 2218);
    			attr_dev(div2, "class", "col-md-6 text-nowrap");
    			add_location(div2, file$a, 53, 28, 2150);
    			attr_dev(div3, "class", "row");
    			add_location(div3, file$a, 52, 24, 2103);
    			attr_dev(p1, "id", "dataTable_info");
    			attr_dev(p1, "class", "dataTables_info");
    			attr_dev(p1, "role", "status");
    			attr_dev(p1, "aria-live", "polite");
    			add_location(p1, file$a, 105, 32, 6167);
    			attr_dev(div4, "class", "col-md-6 align-self-center");
    			add_location(div4, file$a, 104, 28, 6093);
    			attr_dev(span0, "aria-hidden", "true");
    			add_location(span0, file$a, 110, 189, 6733);
    			attr_dev(a0, "class", "page-link");
    			attr_dev(a0, "aria-label", "Previous");
    			attr_dev(a0, "href", "");
    			add_location(a0, file$a, 110, 90, 6634);
    			attr_dev(li0, "class", "page-item");
    			toggle_class(li0, "disabled", /*page*/ ctx[0] === 1);
    			add_location(li0, file$a, 110, 40, 6584);
    			attr_dev(span1, "aria-hidden", "true");
    			add_location(span1, file$a, 114, 218, 7310);
    			attr_dev(a1, "class", "page-link");
    			attr_dev(a1, "aria-label", "Next");
    			attr_dev(a1, "href", "");
    			add_location(a1, file$a, 114, 115, 7207);
    			attr_dev(li1, "class", "page-item");
    			toggle_class(li1, "disabled", /*page*/ ctx[0] === /*pageCount*/ ctx[2] || /*pageCount*/ ctx[2] < 2);
    			add_location(li1, file$a, 114, 40, 7132);
    			attr_dev(ul, "class", "pagination");
    			add_location(ul, file$a, 109, 36, 6519);
    			attr_dev(nav, "class", "d-lg-flex justify-content-lg-end dataTables_paginate paging_simple_numbers");
    			add_location(nav, file$a, 108, 32, 6393);
    			attr_dev(div5, "class", "col-md-6");
    			add_location(div5, file$a, 107, 28, 6337);
    			attr_dev(div6, "class", "row");
    			add_location(div6, file$a, 103, 24, 6046);
    			attr_dev(div7, "class", "card-body content-color");
    			add_location(div7, file$a, 51, 20, 2040);
    			attr_dev(div8, "class", "card shadow");
    			add_location(div8, file$a, 47, 16, 1839);
    			attr_dev(div9, "class", "container-fluid mb-5");
    			add_location(div9, file$a, 45, 12, 1724);
    			attr_dev(div10, "id", "content");
    			attr_dev(div10, "class", "background-color");
    			add_location(div10, file$a, 42, 8, 1614);
    			attr_dev(div11, "class", "d-flex flex-column");
    			attr_dev(div11, "id", "content-wrapper");
    			add_location(div11, file$a, 41, 4, 1551);
    			attr_dev(div12, "id", "wrapper");
    			add_location(div12, file$a, 38, 0, 1458);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div12, anchor);
    			mount_component(navigator, div12, null);
    			append_dev(div12, t0);
    			append_dev(div12, div11);
    			append_dev(div11, div10);
    			mount_component(header, div10, null);
    			append_dev(div10, t1);
    			append_dev(div10, div9);
    			append_dev(div9, h3);
    			append_dev(div9, t3);
    			append_dev(div9, div8);
    			append_dev(div8, div0);
    			append_dev(div0, p0);
    			append_dev(div8, t5);
    			append_dev(div8, div7);
    			append_dev(div7, div3);
    			append_dev(div3, div2);
    			append_dev(div2, div1);
    			append_dev(div1, label);
    			append_dev(label, t6);
    			append_dev(label, select);
    			append_dev(select, option0);
    			append_dev(select, option1);
    			append_dev(select, option2);
    			append_dev(select, option3);
    			select_option(select, /*limit*/ ctx[1], true);
    			append_dev(label, t11);
    			append_dev(div7, t12);
    			if_blocks[current_block_type_index].m(div7, null);
    			append_dev(div7, t13);
    			append_dev(div7, div6);
    			append_dev(div6, div4);
    			append_dev(div4, p1);
    			append_dev(p1, t14);
    			append_dev(div6, t15);
    			append_dev(div6, div5);
    			append_dev(div5, nav);
    			append_dev(nav, ul);
    			append_dev(ul, li0);
    			append_dev(li0, a0);
    			append_dev(a0, span0);
    			append_dev(ul, t17);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				if (each_blocks[i]) {
    					each_blocks[i].m(ul, null);
    				}
    			}

    			append_dev(ul, t18);
    			append_dev(ul, li1);
    			append_dev(li1, a1);
    			append_dev(a1, span1);
    			append_dev(div11, t20);
    			mount_component(footer, div11, null);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(select, "change", /*select_change_handler*/ ctx[9]),
    					listen_dev(a0, "click", /*click_handler*/ ctx[10], false, false, false, false),
    					listen_dev(a1, "click", /*click_handler_2*/ ctx[12], false, false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*limit*/ 2) {
    				select_option(select, /*limit*/ ctx[1]);
    			}

    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				} else {
    					if_block.p(ctx, dirty);
    				}

    				transition_in(if_block, 1);
    				if_block.m(div7, t13);
    			}

    			if (!current || dirty & /*displayResultsText*/ 32) set_data_dev(t14, /*displayResultsText*/ ctx[5]);

    			if (!current || dirty & /*page*/ 1) {
    				toggle_class(li0, "disabled", /*page*/ ctx[0] === 1);
    			}

    			if (dirty & /*page, pagesRange*/ 65) {
    				each_value = /*pagesRange*/ ctx[6];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$2(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$2(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(ul, t18);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}

    			if (!current || dirty & /*page, pageCount*/ 5) {
    				toggle_class(li1, "disabled", /*page*/ ctx[0] === /*pageCount*/ ctx[2] || /*pageCount*/ ctx[2] < 2);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(navigator.$$.fragment, local);
    			transition_in(header.$$.fragment, local);
    			transition_in(if_block);
    			transition_in(footer.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(navigator.$$.fragment, local);
    			transition_out(header.$$.fragment, local);
    			transition_out(if_block);
    			transition_out(footer.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div12);
    			destroy_component(navigator);
    			destroy_component(header);
    			if_blocks[current_block_type_index].d();
    			destroy_each(each_blocks, detaching);
    			destroy_component(footer);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$a.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$a($$self, $$props, $$invalidate) {
    	let pageCount;
    	let pagesRange;
    	let $basicDetails;
    	validate_store(basicDetails, 'basicDetails');
    	component_subscribe($$self, basicDetails, $$value => $$invalidate(7, $basicDetails = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Transactions', slots, []);
    	let state;
    	let page = 1;
    	let limit = "10";
    	let totalResults = 0;
    	let transactions = [];
    	let displayResultsText = "Showing 0 to 0 of 0";

    	const fetchData = async () => {
    		$$invalidate(3, state = NetworkStates.loading);
    		let result = await fetchAndSendDataWithJsonAndQuery("/transactions", { page, limit });

    		if (result.status) {
    			$$invalidate(8, totalResults = result.totalTransactions);
    			$$invalidate(4, transactions = result.data.results);
    			$$invalidate(3, state = NetworkStates.loaded);
    		} else {
    			$$invalidate(3, state = NetworkStates.error);
    		}
    	};

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Transactions> was created with unknown prop '${key}'`);
    	});

    	function select_change_handler() {
    		limit = select_value(this);
    		$$invalidate(1, limit);
    	}

    	const click_handler = () => {
    		if (page - 1 >= 1) {
    			$$invalidate(0, page--, page);
    		}
    	};

    	const click_handler_1 = pageNumber => {
    		$$invalidate(0, page = pageNumber);
    	};

    	const click_handler_2 = () => {
    		if (page + 1 <= pageCount) {
    			$$invalidate(0, page++, page);
    		}
    	};

    	$$self.$capture_state = () => ({
    		Footer: DashboardFooter,
    		Navigator: DashboardNavigator,
    		Header: DashboardHeader,
    		HorizontalLoader,
    		NetworkStates,
    		fetchAndSendDataWithJsonAndQuery,
    		formatUTCDate,
    		basicDetails,
    		actualCurrency,
    		state,
    		page,
    		limit,
    		totalResults,
    		transactions,
    		displayResultsText,
    		fetchData,
    		pageCount,
    		pagesRange,
    		$basicDetails
    	});

    	$$self.$inject_state = $$props => {
    		if ('state' in $$props) $$invalidate(3, state = $$props.state);
    		if ('page' in $$props) $$invalidate(0, page = $$props.page);
    		if ('limit' in $$props) $$invalidate(1, limit = $$props.limit);
    		if ('totalResults' in $$props) $$invalidate(8, totalResults = $$props.totalResults);
    		if ('transactions' in $$props) $$invalidate(4, transactions = $$props.transactions);
    		if ('displayResultsText' in $$props) $$invalidate(5, displayResultsText = $$props.displayResultsText);
    		if ('pageCount' in $$props) $$invalidate(2, pageCount = $$props.pageCount);
    		if ('pagesRange' in $$props) $$invalidate(6, pagesRange = $$props.pagesRange);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*limit, page*/ 3) {
    			fetchData();
    		}

    		if ($$self.$$.dirty & /*page, limit, totalResults*/ 259) {
    			{
    				const currentCount = page * limit;

    				$$invalidate(5, displayResultsText = `Showing ${(page - 1) * limit + 1} to ${currentCount <= totalResults
				? currentCount
				: totalResults} of ${totalResults}`);
    			}
    		}

    		if ($$self.$$.dirty & /*totalResults, limit*/ 258) {
    			$$invalidate(2, pageCount = totalResults / limit < 1
    			? 1
    			: Math.ceil(totalResults / limit));
    		}

    		if ($$self.$$.dirty & /*pageCount*/ 4) {
    			$$invalidate(6, pagesRange = Array.from({ length: pageCount - 1 + 1 }, (_, i) => 1 + i));
    		}
    	};

    	return [
    		page,
    		limit,
    		pageCount,
    		state,
    		transactions,
    		displayResultsText,
    		pagesRange,
    		$basicDetails,
    		totalResults,
    		select_change_handler,
    		click_handler,
    		click_handler_1,
    		click_handler_2
    	];
    }

    class Transactions extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$a, create_fragment$a, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Transactions",
    			options,
    			id: create_fragment$a.name
    		});
    	}
    }

    /* src\pages\dashboard\Withdraw.svelte generated by Svelte v3.59.2 */
    const file$9 = "src\\pages\\dashboard\\Withdraw.svelte";

    function get_each_context$1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[13] = list[i];
    	return child_ctx;
    }

    // (105:12) {:else}
    function create_else_block$4(ctx) {
    	let spinkit;
    	let current;
    	spinkit = new Spinkit({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(spinkit.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(spinkit, target, anchor);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(spinkit.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(spinkit.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(spinkit, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$4.name,
    		type: "else",
    		source: "(105:12) {:else}",
    		ctx
    	});

    	return block;
    }

    // (103:52) 
    function create_if_block_1$4(ctx) {
    	let loadingerror;
    	let current;

    	loadingerror = new LoadingError({
    			props: { message: /*errorMessage*/ ctx[3] },
    			$$inline: true
    		});

    	loadingerror.$on("click", /*fetchData*/ ctx[7]);

    	const block = {
    		c: function create() {
    			create_component(loadingerror.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(loadingerror, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const loadingerror_changes = {};
    			if (dirty & /*errorMessage*/ 8) loadingerror_changes.message = /*errorMessage*/ ctx[3];
    			loadingerror.$set(loadingerror_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(loadingerror.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(loadingerror.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(loadingerror, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$4.name,
    		type: "if",
    		source: "(103:52) ",
    		ctx
    	});

    	return block;
    }

    // (64:12) {#if state === NetworkStates.loaded}
    function create_if_block$4(ctx) {
    	let div5;
    	let div4;
    	let h1;
    	let t1;
    	let div0;
    	let t2;
    	let span0;
    	let t3_value = actualCurrency(/*$basicDetails*/ ctx[6].currency) + "";
    	let t3;
    	let t4;
    	let t5;
    	let form;
    	let input0;
    	let t6;
    	let input1;
    	let t7;
    	let p;
    	let t9;
    	let div1;
    	let t10;
    	let div2;
    	let button;
    	let span1;
    	let t11;
    	let t12;
    	let div3;
    	let mounted;
    	let dispose;
    	let each_value = /*paymentMethods*/ ctx[0];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$1(get_each_context$1(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			div5 = element("div");
    			div4 = element("div");
    			h1 = element("h1");
    			h1.textContent = "Withdraw to personal wallet";
    			t1 = space();
    			div0 = element("div");
    			t2 = text("Balance: ");
    			span0 = element("span");
    			t3 = text(t3_value);
    			t4 = text(/*balance*/ ctx[4]);
    			t5 = space();
    			form = element("form");
    			input0 = element("input");
    			t6 = space();
    			input1 = element("input");
    			t7 = space();
    			p = element("p");
    			p.textContent = "preferred payment method";
    			t9 = space();
    			div1 = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t10 = space();
    			div2 = element("div");
    			button = element("button");
    			span1 = element("span");
    			t11 = text(" Withdraw");
    			t12 = space();
    			div3 = element("div");
    			div3.textContent = "Please ensure the wallet address is correct to avoid losing funds.";
    			attr_dev(h1, "class", "center-text text-uppercase svelte-1fet26b");
    			add_location(h1, file$9, 66, 20, 2185);
    			attr_dev(span0, "id", "balance");
    			add_location(span0, file$9, 68, 33, 2346);
    			attr_dev(div0, "class", "balance center-text svelte-1fet26b");
    			add_location(div0, file$9, 67, 20, 2278);
    			attr_dev(input0, "class", "get-started-input-fields svelte-1fet26b");
    			attr_dev(input0, "type", "text");
    			attr_dev(input0, "id", "wallet-address");
    			attr_dev(input0, "name", "wallet-address");
    			input0.required = true;
    			attr_dev(input0, "placeholder", "Wallet Address");
    			add_location(input0, file$9, 71, 24, 2544);
    			attr_dev(input1, "class", "get-started-input-fields mt-2 svelte-1fet26b");
    			attr_dev(input1, "type", "number");
    			attr_dev(input1, "id", "amount");
    			attr_dev(input1, "name", "amount");
    			input1.required = true;
    			attr_dev(input1, "placeholder", "Amount");
    			add_location(input1, file$9, 73, 24, 2748);
    			attr_dev(p, "class", "label text-capitalize text-align-start svelte-1fet26b");
    			attr_dev(p, "for", "crypto-type");
    			add_location(p, file$9, 75, 24, 2934);
    			attr_dev(div1, "class", "selectgroup selectgroup-pills mt-1 mb-3");
    			add_location(div1, file$9, 76, 24, 3056);
    			attr_dev(span1, "class", "spinner-grow spinner-grow-sm");
    			attr_dev(span1, "role", "status");
    			attr_dev(span1, "aria-hidden", "true");
    			toggle_class(span1, "d-none", !/*isSubmitting*/ ctx[5]);
    			add_location(span1, file$9, 93, 32, 4212);
    			attr_dev(button, "type", "submit");
    			attr_dev(button, "class", "button svelte-1fet26b");
    			button.disabled = /*isSubmitting*/ ctx[5];
    			add_location(button, file$9, 92, 28, 4117);
    			attr_dev(div2, "class", "center-text mt-3 svelte-1fet26b");
    			add_location(div2, file$9, 91, 24, 4057);
    			add_location(form, file$9, 70, 20, 2471);
    			attr_dev(div3, "class", "footer-t center-text svelte-1fet26b");
    			add_location(div3, file$9, 97, 20, 4455);
    			attr_dev(div4, "class", "container svelte-1fet26b");
    			add_location(div4, file$9, 65, 20, 2140);
    			attr_dev(div5, "class", "body svelte-1fet26b");
    			add_location(div5, file$9, 64, 16, 2100);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div5, anchor);
    			append_dev(div5, div4);
    			append_dev(div4, h1);
    			append_dev(div4, t1);
    			append_dev(div4, div0);
    			append_dev(div0, t2);
    			append_dev(div0, span0);
    			append_dev(span0, t3);
    			append_dev(span0, t4);
    			append_dev(div4, t5);
    			append_dev(div4, form);
    			append_dev(form, input0);
    			set_input_value(input0, /*values*/ ctx[1].address);
    			append_dev(form, t6);
    			append_dev(form, input1);
    			set_input_value(input1, /*values*/ ctx[1].amount);
    			append_dev(form, t7);
    			append_dev(form, p);
    			append_dev(form, t9);
    			append_dev(form, div1);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				if (each_blocks[i]) {
    					each_blocks[i].m(div1, null);
    				}
    			}

    			append_dev(form, t10);
    			append_dev(form, div2);
    			append_dev(div2, button);
    			append_dev(button, span1);
    			append_dev(button, t11);
    			append_dev(div4, t12);
    			append_dev(div4, div3);

    			if (!mounted) {
    				dispose = [
    					listen_dev(input0, "input", /*input0_input_handler*/ ctx[9]),
    					listen_dev(input1, "input", /*input1_input_handler*/ ctx[10]),
    					listen_dev(form, "submit", prevent_default(/*submitRequest*/ ctx[8]), false, true, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*$basicDetails*/ 64 && t3_value !== (t3_value = actualCurrency(/*$basicDetails*/ ctx[6].currency) + "")) set_data_dev(t3, t3_value);
    			if (dirty & /*balance*/ 16) set_data_dev(t4, /*balance*/ ctx[4]);

    			if (dirty & /*values*/ 2 && input0.value !== /*values*/ ctx[1].address) {
    				set_input_value(input0, /*values*/ ctx[1].address);
    			}

    			if (dirty & /*values*/ 2 && to_number(input1.value) !== /*values*/ ctx[1].amount) {
    				set_input_value(input1, /*values*/ ctx[1].amount);
    			}

    			if (dirty & /*transformPaymentValue, paymentMethods, values*/ 3) {
    				each_value = /*paymentMethods*/ ctx[0];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$1(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$1(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(div1, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}

    			if (dirty & /*isSubmitting*/ 32) {
    				toggle_class(span1, "d-none", !/*isSubmitting*/ ctx[5]);
    			}

    			if (dirty & /*isSubmitting*/ 32) {
    				prop_dev(button, "disabled", /*isSubmitting*/ ctx[5]);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div5);
    			destroy_each(each_blocks, detaching);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$4.name,
    		type: "if",
    		source: "(64:12) {#if state === NetworkStates.loaded}",
    		ctx
    	});

    	return block;
    }

    // (78:28) {#each paymentMethods as payment}
    function create_each_block$1(ctx) {
    	let label;
    	let input;
    	let input_value_value;
    	let value_has_changed = false;
    	let t0;
    	let span;
    	let t1_value = transformPaymentValue(/*payment*/ ctx[13]) + "";
    	let t1;
    	let t2;
    	let binding_group;
    	let mounted;
    	let dispose;
    	binding_group = init_binding_group(/*$$binding_groups*/ ctx[12][0]);

    	const block = {
    		c: function create() {
    			label = element("label");
    			input = element("input");
    			t0 = space();
    			span = element("span");
    			t1 = text(t1_value);
    			t2 = space();
    			attr_dev(input, "type", "radio");
    			attr_dev(input, "name", "payment-method");
    			input.__value = input_value_value = /*payment*/ ctx[13];
    			input.value = input.__value;
    			attr_dev(input, "class", "selectgroup-input");
    			add_location(input, file$9, 79, 36, 3298);
    			attr_dev(span, "class", "selectgroup-button text-uppercase");
    			add_location(span, file$9, 80, 36, 3449);
    			attr_dev(label, "class", "selectgroup-item my-2 align-self-start");
    			add_location(label, file$9, 78, 32, 3206);
    			binding_group.p(input);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, label, anchor);
    			append_dev(label, input);
    			input.checked = input.__value === /*values*/ ctx[1].method;
    			append_dev(label, t0);
    			append_dev(label, span);
    			append_dev(span, t1);
    			append_dev(label, t2);

    			if (!mounted) {
    				dispose = listen_dev(input, "change", /*input_change_handler*/ ctx[11]);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*paymentMethods*/ 1 && input_value_value !== (input_value_value = /*payment*/ ctx[13])) {
    				prop_dev(input, "__value", input_value_value);
    				input.value = input.__value;
    				value_has_changed = true;
    			}

    			if (value_has_changed || dirty & /*values, paymentMethods*/ 3) {
    				input.checked = input.__value === /*values*/ ctx[1].method;
    			}

    			if (dirty & /*paymentMethods*/ 1 && t1_value !== (t1_value = transformPaymentValue(/*payment*/ ctx[13]) + "")) set_data_dev(t1, t1_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(label);
    			binding_group.r();
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$1.name,
    		type: "each",
    		source: "(78:28) {#each paymentMethods as payment}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$9(ctx) {
    	let div2;
    	let navigator;
    	let t0;
    	let div1;
    	let div0;
    	let header;
    	let t1;
    	let current_block_type_index;
    	let if_block;
    	let t2;
    	let footer;
    	let current;

    	navigator = new DashboardNavigator({
    			props: { active: "withdraw" },
    			$$inline: true
    		});

    	header = new DashboardHeader({ $$inline: true });
    	const if_block_creators = [create_if_block$4, create_if_block_1$4, create_else_block$4];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*state*/ ctx[2] === NetworkStates.loaded) return 0;
    		if (/*state*/ ctx[2] === NetworkStates.error) return 1;
    		return 2;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    	footer = new DashboardFooter({ $$inline: true });

    	const block = {
    		c: function create() {
    			div2 = element("div");
    			create_component(navigator.$$.fragment);
    			t0 = space();
    			div1 = element("div");
    			div0 = element("div");
    			create_component(header.$$.fragment);
    			t1 = space();
    			if_block.c();
    			t2 = space();
    			create_component(footer.$$.fragment);
    			attr_dev(div0, "id", "content");
    			attr_dev(div0, "class", "background-color");
    			add_location(div0, file$9, 59, 8, 1889);
    			attr_dev(div1, "class", "d-flex flex-column");
    			attr_dev(div1, "id", "content-wrapper");
    			add_location(div1, file$9, 58, 4, 1826);
    			attr_dev(div2, "id", "wrapper");
    			add_location(div2, file$9, 55, 0, 1737);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div2, anchor);
    			mount_component(navigator, div2, null);
    			append_dev(div2, t0);
    			append_dev(div2, div1);
    			append_dev(div1, div0);
    			mount_component(header, div0, null);
    			append_dev(div0, t1);
    			if_blocks[current_block_type_index].m(div0, null);
    			append_dev(div1, t2);
    			mount_component(footer, div1, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				} else {
    					if_block.p(ctx, dirty);
    				}

    				transition_in(if_block, 1);
    				if_block.m(div0, null);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(navigator.$$.fragment, local);
    			transition_in(header.$$.fragment, local);
    			transition_in(if_block);
    			transition_in(footer.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(navigator.$$.fragment, local);
    			transition_out(header.$$.fragment, local);
    			transition_out(if_block);
    			transition_out(footer.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div2);
    			destroy_component(navigator);
    			destroy_component(header);
    			if_blocks[current_block_type_index].d();
    			destroy_component(footer);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$9.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$9($$self, $$props, $$invalidate) {
    	let $basicDetails;
    	validate_store(basicDetails, 'basicDetails');
    	component_subscribe($$self, basicDetails, $$value => $$invalidate(6, $basicDetails = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Withdraw', slots, []);
    	let paymentMethods = [];
    	let values = { address: "", amount: 0, method: "" };
    	let state;
    	let errorMessage;
    	let balance;
    	let isSubmitting = false;

    	const fetchData = async () => {
    		$$invalidate(2, state = NetworkStates.loading);
    		let result = await fetchAndSendDataWithJson("/withdraw");

    		if (result.status) {
    			$$invalidate(4, balance = result.data.balance);
    			$$invalidate(0, paymentMethods = result.data.methods);
    			$$invalidate(2, state = NetworkStates.loaded);
    		} else {
    			$$invalidate(3, errorMessage = result.message);
    			$$invalidate(2, state = NetworkStates.error);
    		}
    	};

    	const submitRequest = async evt => {
    		$$invalidate(5, isSubmitting = true);
    		let result = await fetchAndSendDataWithJson("/withdraw", values, 'POST');
    		$$invalidate(5, isSubmitting = false);

    		if (result.status) {
    			$$invalidate(1, values.address = "", values);
    			$$invalidate(1, values.amount = 0, values);
    			$$invalidate(1, values.method = "", values);
    			evt.target.reset();
    			alertUser("", result.message, "success");
    		} else {
    			alertUser("", result.message, "error");
    		}
    	};

    	onMount(() => {
    		fetchData();
    	});

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Withdraw> was created with unknown prop '${key}'`);
    	});

    	const $$binding_groups = [[]];

    	function input0_input_handler() {
    		values.address = this.value;
    		$$invalidate(1, values);
    	}

    	function input1_input_handler() {
    		values.amount = to_number(this.value);
    		$$invalidate(1, values);
    	}

    	function input_change_handler() {
    		values.method = this.__value;
    		$$invalidate(1, values);
    	}

    	$$self.$capture_state = () => ({
    		Footer: DashboardFooter,
    		Navigator: DashboardNavigator,
    		Header: DashboardHeader,
    		Spinkit,
    		LoadingError,
    		NetworkStates,
    		alertUser,
    		fetchAndSendDataWithJson,
    		transformPaymentValue,
    		basicDetails,
    		actualCurrency,
    		onMount,
    		paymentMethods,
    		values,
    		state,
    		errorMessage,
    		balance,
    		isSubmitting,
    		fetchData,
    		submitRequest,
    		$basicDetails
    	});

    	$$self.$inject_state = $$props => {
    		if ('paymentMethods' in $$props) $$invalidate(0, paymentMethods = $$props.paymentMethods);
    		if ('values' in $$props) $$invalidate(1, values = $$props.values);
    		if ('state' in $$props) $$invalidate(2, state = $$props.state);
    		if ('errorMessage' in $$props) $$invalidate(3, errorMessage = $$props.errorMessage);
    		if ('balance' in $$props) $$invalidate(4, balance = $$props.balance);
    		if ('isSubmitting' in $$props) $$invalidate(5, isSubmitting = $$props.isSubmitting);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		paymentMethods,
    		values,
    		state,
    		errorMessage,
    		balance,
    		isSubmitting,
    		$basicDetails,
    		fetchData,
    		submitRequest,
    		input0_input_handler,
    		input1_input_handler,
    		input_change_handler,
    		$$binding_groups
    	];
    }

    class Withdraw extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$9, create_fragment$9, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Withdraw",
    			options,
    			id: create_fragment$9.name
    		});
    	}
    }

    /* src\components\settings\support.svelte generated by Svelte v3.59.2 */

    const file$8 = "src\\components\\settings\\support.svelte";

    function create_fragment$8(ctx) {
    	let div9;
    	let div1;
    	let p0;
    	let t1;
    	let div0;
    	let input;
    	let t2;
    	let div8;
    	let div2;
    	let p1;
    	let t4;
    	let div7;
    	let div6;
    	let div5;
    	let form;
    	let div3;
    	let label;
    	let strong;
    	let textarea;
    	let t6;
    	let div4;
    	let button;
    	let span;
    	let t7;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			div9 = element("div");
    			div1 = element("div");
    			p0 = element("p");
    			p0.textContent = "Notifications";
    			t1 = space();
    			div0 = element("div");
    			input = element("input");
    			t2 = space();
    			div8 = element("div");
    			div2 = element("div");
    			p1 = element("p");
    			p1.textContent = "Contact Support";
    			t4 = space();
    			div7 = element("div");
    			div6 = element("div");
    			div5 = element("div");
    			form = element("form");
    			div3 = element("div");
    			label = element("label");
    			strong = element("strong");
    			strong.textContent = "Message";
    			textarea = element("textarea");
    			t6 = space();
    			div4 = element("div");
    			button = element("button");
    			span = element("span");
    			t7 = text(" Send");
    			attr_dev(p0, "class", "fw-bolder");
    			add_location(p0, file$8, 27, 8, 839);
    			attr_dev(input, "class", "form-check-input");
    			attr_dev(input, "type", "checkbox");
    			attr_dev(input, "id", "formCheck-1");
    			attr_dev(input, "name", "notification");
    			add_location(input, file$8, 30, 12, 939);
    			attr_dev(div0, "class", "form-check form-switch");
    			add_location(div0, file$8, 29, 8, 889);
    			attr_dev(div1, "class", "mb-3 mt-1 d-flex justify-content-between");
    			add_location(div1, file$8, 26, 4, 775);
    			attr_dev(p1, "class", "m-0 fw-bold");
    			add_location(p1, file$8, 36, 12, 1200);
    			attr_dev(div2, "class", "card-header py-3 content-color");
    			add_location(div2, file$8, 35, 8, 1142);
    			add_location(strong, file$8, 42, 84, 1540);
    			attr_dev(label, "class", "form-label");
    			attr_dev(label, "for", "signature");
    			add_location(label, file$8, 42, 42, 1498);
    			textarea.required = true;
    			attr_dev(textarea, "class", "form-control");
    			attr_dev(textarea, "id", "signature");
    			attr_dev(textarea, "rows", "4");
    			attr_dev(textarea, "name", "message");
    			set_style(textarea, "background", "inherit");
    			set_style(textarea, "color", "var(--semi-white)");
    			add_location(textarea, file$8, 42, 116, 1572);
    			attr_dev(div3, "class", "mb-3");
    			add_location(div3, file$8, 42, 24, 1480);
    			attr_dev(span, "class", "spinner-grow spinner-grow-sm");
    			attr_dev(span, "role", "status");
    			attr_dev(span, "aria-hidden", "true");
    			toggle_class(span, "d-none", !/*isSubmittingMessageToSupport*/ ctx[1]);
    			add_location(span, file$8, 45, 32, 1963);
    			attr_dev(button, "class", "btn btn-primary btn-sm");
    			attr_dev(button, "type", "submit");
    			button.disabled = /*isSubmittingMessageToSupport*/ ctx[1];
    			add_location(button, file$8, 44, 28, 1836);
    			attr_dev(div4, "class", "mb-3");
    			add_location(div4, file$8, 43, 24, 1788);
    			add_location(form, file$8, 41, 20, 1398);
    			attr_dev(div5, "class", "col-md-6 content-color");
    			add_location(div5, file$8, 40, 16, 1340);
    			attr_dev(div6, "class", "row");
    			add_location(div6, file$8, 39, 12, 1305);
    			attr_dev(div7, "class", "card-body");
    			add_location(div7, file$8, 38, 8, 1268);
    			attr_dev(div8, "class", "card shadow mb-5 content-color");
    			add_location(div8, file$8, 34, 4, 1088);
    			add_location(div9, file$8, 25, 0, 764);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div9, anchor);
    			append_dev(div9, div1);
    			append_dev(div1, p0);
    			append_dev(div1, t1);
    			append_dev(div1, div0);
    			append_dev(div0, input);
    			input.checked = /*notification*/ ctx[0];
    			append_dev(div9, t2);
    			append_dev(div9, div8);
    			append_dev(div8, div2);
    			append_dev(div2, p1);
    			append_dev(div8, t4);
    			append_dev(div8, div7);
    			append_dev(div7, div6);
    			append_dev(div6, div5);
    			append_dev(div5, form);
    			append_dev(form, div3);
    			append_dev(div3, label);
    			append_dev(label, strong);
    			append_dev(div3, textarea);
    			set_input_value(textarea, /*contactSupportData*/ ctx[2].message);
    			append_dev(form, t6);
    			append_dev(form, div4);
    			append_dev(div4, button);
    			append_dev(button, span);
    			append_dev(button, t7);

    			if (!mounted) {
    				dispose = [
    					listen_dev(input, "change", /*input_change_handler*/ ctx[4]),
    					listen_dev(textarea, "input", /*textarea_input_handler*/ ctx[5]),
    					listen_dev(form, "submit", prevent_default(/*submitMessageToSupport*/ ctx[3]), false, true, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*notification*/ 1) {
    				input.checked = /*notification*/ ctx[0];
    			}

    			if (dirty & /*contactSupportData*/ 4) {
    				set_input_value(textarea, /*contactSupportData*/ ctx[2].message);
    			}

    			if (dirty & /*isSubmittingMessageToSupport*/ 2) {
    				toggle_class(span, "d-none", !/*isSubmittingMessageToSupport*/ ctx[1]);
    			}

    			if (dirty & /*isSubmittingMessageToSupport*/ 2) {
    				prop_dev(button, "disabled", /*isSubmittingMessageToSupport*/ ctx[1]);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div9);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$8.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$8($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Support', slots, []);
    	let { notification } = $$props;
    	let isSubmittingMessageToSupport = false;
    	let contactSupportData = { message: "", notifyMe: notification };

    	const submitMessageToSupport = async evt => {
    		$$invalidate(1, isSubmittingMessageToSupport = true);
    		let result = await fetchAndSendDataWithJson("/user-contact", contactSupportData, 'POST');
    		$$invalidate(1, isSubmittingMessageToSupport = false);

    		if (result.status) {
    			evt.target.reset();
    			alertUser("", result.message, "success");
    		} else {
    			alertUser("Message sending failed", result.message, "error");
    		}
    	};

    	$$self.$$.on_mount.push(function () {
    		if (notification === undefined && !('notification' in $$props || $$self.$$.bound[$$self.$$.props['notification']])) {
    			console.warn("<Support> was created without expected prop 'notification'");
    		}
    	});

    	const writable_props = ['notification'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Support> was created with unknown prop '${key}'`);
    	});

    	function input_change_handler() {
    		notification = this.checked;
    		$$invalidate(0, notification);
    	}

    	function textarea_input_handler() {
    		contactSupportData.message = this.value;
    		$$invalidate(2, contactSupportData);
    	}

    	$$self.$$set = $$props => {
    		if ('notification' in $$props) $$invalidate(0, notification = $$props.notification);
    	};

    	$$self.$capture_state = () => ({
    		fetchAndSendDataWithJson,
    		alertUser,
    		notification,
    		isSubmittingMessageToSupport,
    		contactSupportData,
    		submitMessageToSupport
    	});

    	$$self.$inject_state = $$props => {
    		if ('notification' in $$props) $$invalidate(0, notification = $$props.notification);
    		if ('isSubmittingMessageToSupport' in $$props) $$invalidate(1, isSubmittingMessageToSupport = $$props.isSubmittingMessageToSupport);
    		if ('contactSupportData' in $$props) $$invalidate(2, contactSupportData = $$props.contactSupportData);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		notification,
    		isSubmittingMessageToSupport,
    		contactSupportData,
    		submitMessageToSupport,
    		input_change_handler,
    		textarea_input_handler
    	];
    }

    class Support extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$8, create_fragment$8, safe_not_equal, { notification: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Support",
    			options,
    			id: create_fragment$8.name
    		});
    	}

    	get notification() {
    		throw new Error("<Support>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set notification(value) {
    		throw new Error("<Support>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\components\settings\general.svelte generated by Svelte v3.59.2 */
    const file$7 = "src\\components\\settings\\general.svelte";

    function create_fragment$7(ctx) {
    	let div3;
    	let div0;
    	let p0;
    	let t1;
    	let select0;
    	let option0;
    	let option1;
    	let option2;
    	let t5;
    	let div2;
    	let p1;
    	let t7;
    	let div1;
    	let t8;
    	let select1;
    	let option3;
    	let option4;
    	let option5;
    	let option6;
    	let option7;
    	let option8;
    	let option9;
    	let option10;
    	let option11;
    	let option12;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			div3 = element("div");
    			div0 = element("div");
    			p0 = element("p");
    			p0.textContent = "Default Currency";
    			t1 = space();
    			select0 = element("select");
    			option0 = element("option");
    			option0.textContent = "Euro €";
    			option1 = element("option");
    			option1.textContent = "GBP £";
    			option2 = element("option");
    			option2.textContent = "USD $";
    			t5 = space();
    			div2 = element("div");
    			p1 = element("p");
    			p1.textContent = "Default Language";
    			t7 = space();
    			div1 = element("div");
    			t8 = space();
    			select1 = element("select");
    			option3 = element("option");
    			option3.textContent = "English";
    			option4 = element("option");
    			option4.textContent = "Spanish";
    			option5 = element("option");
    			option5.textContent = "French";
    			option6 = element("option");
    			option6.textContent = "German";
    			option7 = element("option");
    			option7.textContent = "Chinese";
    			option8 = element("option");
    			option8.textContent = "Russian";
    			option9 = element("option");
    			option9.textContent = "Japanese";
    			option10 = element("option");
    			option10.textContent = "Arabic";
    			option11 = element("option");
    			option11.textContent = "Portuguese";
    			option12 = element("option");
    			option12.textContent = "Hindi";
    			attr_dev(p0, "class", "fw-bolder");
    			add_location(p0, file$7, 11, 8, 283);
    			option0.__value = "eur";
    			option0.value = option0.__value;
    			attr_dev(option0, "class", "svelte-foyc04");
    			add_location(option0, file$7, 13, 12, 408);
    			option1.__value = "gbp";
    			option1.value = option1.__value;
    			attr_dev(option1, "class", "svelte-foyc04");
    			add_location(option1, file$7, 14, 12, 457);
    			option2.__value = "usd";
    			option2.value = option2.__value;
    			attr_dev(option2, "class", "svelte-foyc04");
    			add_location(option2, file$7, 15, 12, 505);
    			attr_dev(select0, "name", "currency");
    			attr_dev(select0, "id", "currency");
    			attr_dev(select0, "class", "svelte-foyc04");
    			if (/*currency*/ ctx[1] === void 0) add_render_callback(() => /*select0_change_handler*/ ctx[2].call(select0));
    			add_location(select0, file$7, 12, 8, 334);
    			attr_dev(div0, "class", "d-flex justify-content-between align-items-center my-2 align-middle");
    			add_location(div0, file$7, 10, 4, 192);
    			attr_dev(p1, "class", "fw-bolder");
    			add_location(p1, file$7, 20, 8, 657);
    			attr_dev(div1, "class", "d-none");
    			attr_dev(div1, "id", "google_translate_element");
    			add_location(div1, file$7, 21, 8, 708);
    			option3.__value = "en";
    			option3.value = option3.__value;
    			attr_dev(option3, "class", "svelte-foyc04");
    			add_location(option3, file$7, 23, 12, 883);
    			option4.__value = "es";
    			option4.value = option4.__value;
    			attr_dev(option4, "class", "svelte-foyc04");
    			add_location(option4, file$7, 24, 12, 932);
    			option5.__value = "fr";
    			option5.value = option5.__value;
    			attr_dev(option5, "class", "svelte-foyc04");
    			add_location(option5, file$7, 25, 12, 981);
    			option6.__value = "de";
    			option6.value = option6.__value;
    			attr_dev(option6, "class", "svelte-foyc04");
    			add_location(option6, file$7, 26, 12, 1029);
    			option7.__value = "zh-CN";
    			option7.value = option7.__value;
    			attr_dev(option7, "class", "svelte-foyc04");
    			add_location(option7, file$7, 27, 12, 1077);
    			option8.__value = "ru";
    			option8.value = option8.__value;
    			attr_dev(option8, "class", "svelte-foyc04");
    			add_location(option8, file$7, 28, 12, 1129);
    			option9.__value = "ja";
    			option9.value = option9.__value;
    			attr_dev(option9, "class", "svelte-foyc04");
    			add_location(option9, file$7, 29, 12, 1178);
    			option10.__value = "ar";
    			option10.value = option10.__value;
    			attr_dev(option10, "class", "svelte-foyc04");
    			add_location(option10, file$7, 30, 12, 1228);
    			option11.__value = "pt";
    			option11.value = option11.__value;
    			attr_dev(option11, "class", "svelte-foyc04");
    			add_location(option11, file$7, 31, 12, 1276);
    			option12.__value = "hi";
    			option12.value = option12.__value;
    			attr_dev(option12, "class", "svelte-foyc04");
    			add_location(option12, file$7, 32, 12, 1328);
    			attr_dev(select1, "name", "language");
    			attr_dev(select1, "id", "language");
    			attr_dev(select1, "class", "notranslate svelte-foyc04");
    			attr_dev(select1, "translate", "no");
    			if (/*language*/ ctx[0] === void 0) add_render_callback(() => /*select1_change_handler*/ ctx[3].call(select1));
    			add_location(select1, file$7, 22, 8, 774);
    			attr_dev(div2, "class", "d-flex justify-content-between my-2 align-middle d-none");
    			add_location(div2, file$7, 19, 4, 578);
    			add_location(div3, file$7, 9, 0, 181);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div3, anchor);
    			append_dev(div3, div0);
    			append_dev(div0, p0);
    			append_dev(div0, t1);
    			append_dev(div0, select0);
    			append_dev(select0, option0);
    			append_dev(select0, option1);
    			append_dev(select0, option2);
    			select_option(select0, /*currency*/ ctx[1], true);
    			append_dev(div3, t5);
    			append_dev(div3, div2);
    			append_dev(div2, p1);
    			append_dev(div2, t7);
    			append_dev(div2, div1);
    			append_dev(div2, t8);
    			append_dev(div2, select1);
    			append_dev(select1, option3);
    			append_dev(select1, option4);
    			append_dev(select1, option5);
    			append_dev(select1, option6);
    			append_dev(select1, option7);
    			append_dev(select1, option8);
    			append_dev(select1, option9);
    			append_dev(select1, option10);
    			append_dev(select1, option11);
    			append_dev(select1, option12);
    			select_option(select1, /*language*/ ctx[0], true);

    			if (!mounted) {
    				dispose = [
    					listen_dev(select0, "change", /*select0_change_handler*/ ctx[2]),
    					listen_dev(select1, "change", /*select1_change_handler*/ ctx[3])
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*currency*/ 2) {
    				select_option(select0, /*currency*/ ctx[1]);
    			}

    			if (dirty & /*language*/ 1) {
    				select_option(select1, /*language*/ ctx[0]);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div3);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$7.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$7($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('General', slots, []);
    	let { currency } = $$props;
    	let { language } = $$props;

    	$$self.$$.on_mount.push(function () {
    		if (currency === undefined && !('currency' in $$props || $$self.$$.bound[$$self.$$.props['currency']])) {
    			console.warn("<General> was created without expected prop 'currency'");
    		}

    		if (language === undefined && !('language' in $$props || $$self.$$.bound[$$self.$$.props['language']])) {
    			console.warn("<General> was created without expected prop 'language'");
    		}
    	});

    	const writable_props = ['currency', 'language'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<General> was created with unknown prop '${key}'`);
    	});

    	function select0_change_handler() {
    		currency = select_value(this);
    		$$invalidate(1, currency);
    	}

    	function select1_change_handler() {
    		language = select_value(this);
    		$$invalidate(0, language);
    	}

    	$$self.$$set = $$props => {
    		if ('currency' in $$props) $$invalidate(1, currency = $$props.currency);
    		if ('language' in $$props) $$invalidate(0, language = $$props.language);
    	};

    	$$self.$capture_state = () => ({ changeLanguage, currency, language });

    	$$self.$inject_state = $$props => {
    		if ('currency' in $$props) $$invalidate(1, currency = $$props.currency);
    		if ('language' in $$props) $$invalidate(0, language = $$props.language);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*language*/ 1) {
    			changeLanguage(language);
    		}
    	};

    	return [language, currency, select0_change_handler, select1_change_handler];
    }

    class General extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$7, create_fragment$7, safe_not_equal, { currency: 1, language: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "General",
    			options,
    			id: create_fragment$7.name
    		});
    	}

    	get currency() {
    		throw new Error("<General>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set currency(value) {
    		throw new Error("<General>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get language() {
    		throw new Error("<General>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set language(value) {
    		throw new Error("<General>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\components\settings\security.svelte generated by Svelte v3.59.2 */

    const file$6 = "src\\components\\settings\\security.svelte";

    function create_fragment$6(ctx) {
    	let div4;
    	let div0;
    	let input0;
    	let input0_disabled_value;
    	let t0;
    	let button0;
    	let t1;
    	let t2;
    	let div1;
    	let input1;
    	let input1_disabled_value;
    	let t3;
    	let button1;
    	let t4;
    	let t5;
    	let div2;
    	let input2;
    	let input2_disabled_value;
    	let t6;
    	let button2;
    	let t8;
    	let div3;
    	let input3;
    	let t9;
    	let button3;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			div4 = element("div");
    			div0 = element("div");
    			input0 = element("input");
    			t0 = space();
    			button0 = element("button");
    			t1 = text(/*editAddressTitle*/ ctx[7]);
    			t2 = space();
    			div1 = element("div");
    			input1 = element("input");
    			t3 = space();
    			button1 = element("button");
    			t4 = text(/*editMobileTitle*/ ctx[6]);
    			t5 = space();
    			div2 = element("div");
    			input2 = element("input");
    			t6 = space();
    			button2 = element("button");
    			button2.textContent = "Reset";
    			t8 = space();
    			div3 = element("div");
    			input3 = element("input");
    			t9 = space();
    			button3 = element("button");
    			button3.textContent = "Reset Password";
    			attr_dev(input0, "class", "get-started-input-fields text-capitalize me-4");
    			input0.disabled = input0_disabled_value = !/*editAddress*/ ctx[3];
    			attr_dev(input0, "type", "text");
    			attr_dev(input0, "placeholder", "address");
    			attr_dev(input0, "name", "address");
    			toggle_class(input0, "borderless-input", !/*editAddress*/ ctx[3]);
    			add_location(input0, file$6, 30, 8, 993);
    			attr_dev(button0, "class", "text-button");
    			add_location(button0, file$6, 31, 8, 1196);
    			attr_dev(div0, "class", "d-flex justify-content-between align-items-center my-2 align-middle");
    			add_location(div0, file$6, 29, 4, 902);
    			attr_dev(input1, "id", "phone");
    			attr_dev(input1, "class", "get-started-input-fields me-4");
    			input1.disabled = input1_disabled_value = !/*editMobile*/ ctx[4];
    			attr_dev(input1, "type", "text");
    			attr_dev(input1, "placeholder", "phone");
    			attr_dev(input1, "name", "mobile");
    			attr_dev(input1, "pattern", "^\\+?\\d" + (4) + "?[-.\\s]?\\(?\\d" + (5) + "?\\)?[-.\\s]?\\d" + (4) + "[-.\\s]?\\d" + (4) + "[-.\\s]?\\d" + (9) + "$");
    			toggle_class(input1, "borderless-input", !/*editMobile*/ ctx[4]);
    			add_location(input1, file$6, 37, 8, 1432);
    			attr_dev(button1, "class", "text-button");
    			add_location(button1, file$6, 38, 8, 1711);
    			attr_dev(div1, "class", "d-flex justify-content-between align-items-center my-2 align-middle");
    			add_location(div1, file$6, 36, 4, 1341);
    			attr_dev(input2, "class", "get-started-input-fields me-4");
    			input2.disabled = input2_disabled_value = !/*editEmail*/ ctx[5];
    			attr_dev(input2, "type", "email");
    			attr_dev(input2, "placeholder", "email");
    			attr_dev(input2, "name", "email");
    			toggle_class(input2, "borderless-input", !/*editEmail*/ ctx[5]);
    			add_location(input2, file$6, 44, 8, 1944);
    			attr_dev(button2, "class", "text-button");
    			add_location(button2, file$6, 45, 8, 2122);
    			attr_dev(div2, "class", "d-flex justify-content-between align-items-center my-2 align-middle");
    			add_location(div2, file$6, 43, 4, 1853);
    			attr_dev(input3, "class", "get-started-input-fields me-4 colu-5 borderless-input");
    			input3.disabled = true;
    			attr_dev(input3, "type", "text");
    			attr_dev(input3, "placeholder", "**********");
    			attr_dev(input3, "name", "password");
    			add_location(input3, file$6, 51, 8, 2341);
    			attr_dev(button3, "class", "text-button");
    			add_location(button3, file$6, 52, 8, 2482);
    			attr_dev(div3, "class", "d-flex justify-content-between align-items-center my-2 align-middle");
    			add_location(div3, file$6, 50, 4, 2250);
    			add_location(div4, file$6, 28, 0, 891);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div4, anchor);
    			append_dev(div4, div0);
    			append_dev(div0, input0);
    			set_input_value(input0, /*address*/ ctx[0]);
    			append_dev(div0, t0);
    			append_dev(div0, button0);
    			append_dev(button0, t1);
    			append_dev(div4, t2);
    			append_dev(div4, div1);
    			append_dev(div1, input1);
    			set_input_value(input1, /*mobile*/ ctx[1]);
    			append_dev(div1, t3);
    			append_dev(div1, button1);
    			append_dev(button1, t4);
    			append_dev(div4, t5);
    			append_dev(div4, div2);
    			append_dev(div2, input2);
    			set_input_value(input2, /*email*/ ctx[2]);
    			append_dev(div2, t6);
    			append_dev(div2, button2);
    			append_dev(div4, t8);
    			append_dev(div4, div3);
    			append_dev(div3, input3);
    			append_dev(div3, t9);
    			append_dev(div3, button3);

    			if (!mounted) {
    				dispose = [
    					listen_dev(input0, "input", /*input0_input_handler*/ ctx[9]),
    					listen_dev(button0, "click", /*click_handler*/ ctx[10], false, false, false, false),
    					listen_dev(input1, "input", /*input1_input_handler*/ ctx[11]),
    					listen_dev(button1, "click", /*click_handler_1*/ ctx[12], false, false, false, false),
    					listen_dev(input2, "input", /*input2_input_handler*/ ctx[13]),
    					listen_dev(button2, "click", /*click_handler_2*/ ctx[14], false, false, false, false),
    					listen_dev(button3, "click", /*click_handler_3*/ ctx[15], false, false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*editAddress*/ 8 && input0_disabled_value !== (input0_disabled_value = !/*editAddress*/ ctx[3])) {
    				prop_dev(input0, "disabled", input0_disabled_value);
    			}

    			if (dirty & /*address*/ 1 && input0.value !== /*address*/ ctx[0]) {
    				set_input_value(input0, /*address*/ ctx[0]);
    			}

    			if (dirty & /*editAddress*/ 8) {
    				toggle_class(input0, "borderless-input", !/*editAddress*/ ctx[3]);
    			}

    			if (dirty & /*editAddressTitle*/ 128) set_data_dev(t1, /*editAddressTitle*/ ctx[7]);

    			if (dirty & /*editMobile*/ 16 && input1_disabled_value !== (input1_disabled_value = !/*editMobile*/ ctx[4])) {
    				prop_dev(input1, "disabled", input1_disabled_value);
    			}

    			if (dirty & /*mobile*/ 2 && input1.value !== /*mobile*/ ctx[1]) {
    				set_input_value(input1, /*mobile*/ ctx[1]);
    			}

    			if (dirty & /*editMobile*/ 16) {
    				toggle_class(input1, "borderless-input", !/*editMobile*/ ctx[4]);
    			}

    			if (dirty & /*editMobileTitle*/ 64) set_data_dev(t4, /*editMobileTitle*/ ctx[6]);

    			if (dirty & /*editEmail*/ 32 && input2_disabled_value !== (input2_disabled_value = !/*editEmail*/ ctx[5])) {
    				prop_dev(input2, "disabled", input2_disabled_value);
    			}

    			if (dirty & /*email*/ 4 && input2.value !== /*email*/ ctx[2]) {
    				set_input_value(input2, /*email*/ ctx[2]);
    			}

    			if (dirty & /*editEmail*/ 32) {
    				toggle_class(input2, "borderless-input", !/*editEmail*/ ctx[5]);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div4);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$6.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$6($$self, $$props, $$invalidate) {
    	let editAddressTitle;
    	let editMobileTitle;
    	let $basicDetails;
    	validate_store(basicDetails, 'basicDetails');
    	component_subscribe($$self, basicDetails, $$value => $$invalidate(16, $basicDetails = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Security', slots, []);
    	let { address } = $$props;
    	let { mobile } = $$props;
    	let { email } = $$props;
    	let editAddress = false;
    	let editMobile = false;
    	let editEmail = false;

    	async function resetPassword() {
    		let result = await fetchAndSendDataWithJson("/reset-password-mail", { email: $basicDetails.email }, 'POST');
    		alertUser("", result.message);
    	}

    	onMount(() => {
    		const input = document.getElementById("phone");

    		window.intlTelInput(input, {
    			utilsScript: "https://cdn.jsdelivr.net/npm/intl-tel-input@24.0.1/build/js/utils.js"
    		});
    	});

    	$$self.$$.on_mount.push(function () {
    		if (address === undefined && !('address' in $$props || $$self.$$.bound[$$self.$$.props['address']])) {
    			console.warn("<Security> was created without expected prop 'address'");
    		}

    		if (mobile === undefined && !('mobile' in $$props || $$self.$$.bound[$$self.$$.props['mobile']])) {
    			console.warn("<Security> was created without expected prop 'mobile'");
    		}

    		if (email === undefined && !('email' in $$props || $$self.$$.bound[$$self.$$.props['email']])) {
    			console.warn("<Security> was created without expected prop 'email'");
    		}
    	});

    	const writable_props = ['address', 'mobile', 'email'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Security> was created with unknown prop '${key}'`);
    	});

    	function input0_input_handler() {
    		address = this.value;
    		$$invalidate(0, address);
    	}

    	const click_handler = () => {
    		$$invalidate(3, editAddress = !editAddress);
    	};

    	function input1_input_handler() {
    		mobile = this.value;
    		$$invalidate(1, mobile);
    	}

    	const click_handler_1 = () => {
    		$$invalidate(4, editMobile = !editMobile);
    	};

    	function input2_input_handler() {
    		email = this.value;
    		$$invalidate(2, email);
    	}

    	const click_handler_2 = () => {
    		$$invalidate(5, editEmail = !editEmail);
    	};

    	const click_handler_3 = () => {
    		resetPassword();
    	};

    	$$self.$$set = $$props => {
    		if ('address' in $$props) $$invalidate(0, address = $$props.address);
    		if ('mobile' in $$props) $$invalidate(1, mobile = $$props.mobile);
    		if ('email' in $$props) $$invalidate(2, email = $$props.email);
    	};

    	$$self.$capture_state = () => ({
    		onMount,
    		fetchAndSendDataWithJson,
    		alertUser,
    		basicDetails,
    		address,
    		mobile,
    		email,
    		editAddress,
    		editMobile,
    		editEmail,
    		resetPassword,
    		editMobileTitle,
    		editAddressTitle,
    		$basicDetails
    	});

    	$$self.$inject_state = $$props => {
    		if ('address' in $$props) $$invalidate(0, address = $$props.address);
    		if ('mobile' in $$props) $$invalidate(1, mobile = $$props.mobile);
    		if ('email' in $$props) $$invalidate(2, email = $$props.email);
    		if ('editAddress' in $$props) $$invalidate(3, editAddress = $$props.editAddress);
    		if ('editMobile' in $$props) $$invalidate(4, editMobile = $$props.editMobile);
    		if ('editEmail' in $$props) $$invalidate(5, editEmail = $$props.editEmail);
    		if ('editMobileTitle' in $$props) $$invalidate(6, editMobileTitle = $$props.editMobileTitle);
    		if ('editAddressTitle' in $$props) $$invalidate(7, editAddressTitle = $$props.editAddressTitle);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*editAddress*/ 8) {
    			$$invalidate(7, editAddressTitle = editAddress ? "Cancel" : "Change");
    		}

    		if ($$self.$$.dirty & /*editMobile*/ 16) {
    			$$invalidate(6, editMobileTitle = editMobile ? "Cancel" : "Reset");
    		}
    	};

    	return [
    		address,
    		mobile,
    		email,
    		editAddress,
    		editMobile,
    		editEmail,
    		editMobileTitle,
    		editAddressTitle,
    		resetPassword,
    		input0_input_handler,
    		click_handler,
    		input1_input_handler,
    		click_handler_1,
    		input2_input_handler,
    		click_handler_2,
    		click_handler_3
    	];
    }

    class Security extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$6, create_fragment$6, safe_not_equal, { address: 0, mobile: 1, email: 2 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Security",
    			options,
    			id: create_fragment$6.name
    		});
    	}

    	get address() {
    		throw new Error("<Security>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set address(value) {
    		throw new Error("<Security>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get mobile() {
    		throw new Error("<Security>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set mobile(value) {
    		throw new Error("<Security>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get email() {
    		throw new Error("<Security>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set email(value) {
    		throw new Error("<Security>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\pages\dashboard\Settings.svelte generated by Svelte v3.59.2 */
    const file$5 = "src\\pages\\dashboard\\Settings.svelte";

    // (81:12) {:else}
    function create_else_block$3(ctx) {
    	let div4;
    	let div3;
    	let div0;
    	let ul;
    	let li0;
    	let a0;
    	let t1;
    	let li1;
    	let a1;
    	let t3;
    	let li2;
    	let a2;
    	let t5;
    	let div2;
    	let current_block_type_index;
    	let if_block;
    	let t6;
    	let div1;
    	let button;
    	let span;
    	let t7;
    	let current;
    	let mounted;
    	let dispose;
    	const if_block_creators = [create_if_block_2, create_if_block_3, create_else_block_1];
    	const if_blocks = [];

    	function select_block_type_1(ctx, dirty) {
    		if (/*activeTab*/ ctx[0] == 2) return 0;
    		if (/*activeTab*/ ctx[0] == 0) return 1;
    		return 2;
    	}

    	current_block_type_index = select_block_type_1(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block = {
    		c: function create() {
    			div4 = element("div");
    			div3 = element("div");
    			div0 = element("div");
    			ul = element("ul");
    			li0 = element("li");
    			a0 = element("a");
    			a0.textContent = "General";
    			t1 = space();
    			li1 = element("li");
    			a1 = element("a");
    			a1.textContent = "Security";
    			t3 = space();
    			li2 = element("li");
    			a2 = element("a");
    			a2.textContent = "Support";
    			t5 = space();
    			div2 = element("div");
    			if_block.c();
    			t6 = space();
    			div1 = element("div");
    			button = element("button");
    			span = element("span");
    			t7 = text(" Save Settings");
    			attr_dev(a0, "href", "");
    			toggle_class(a0, "active-link", /*activeTab*/ ctx[0] === 0);
    			add_location(a0, file$5, 85, 36, 3145);
    			add_location(li0, file$5, 85, 32, 3141);
    			attr_dev(a1, "href", "");
    			toggle_class(a1, "active-link", /*activeTab*/ ctx[0] === 1);
    			add_location(a1, file$5, 86, 36, 3290);
    			add_location(li1, file$5, 86, 32, 3286);
    			attr_dev(a2, "href", "");
    			toggle_class(a2, "active-link", /*activeTab*/ ctx[0] === 2);
    			add_location(a2, file$5, 87, 36, 3436);
    			add_location(li2, file$5, 87, 32, 3432);
    			attr_dev(ul, "class", "settings-navigation");
    			add_location(ul, file$5, 84, 28, 3075);
    			attr_dev(div0, "class", "content-color colu colu-l-2 my-2");
    			set_style(div0, "height", "fit-content");
    			add_location(div0, file$5, 83, 24, 2970);
    			attr_dev(span, "class", "spinner-grow spinner-grow-sm");
    			attr_dev(span, "role", "status");
    			attr_dev(span, "aria-hidden", "true");
    			toggle_class(span, "d-none", !/*submittingData*/ ctx[1]);
    			add_location(span, file$5, 102, 36, 4429);
    			attr_dev(button, "class", "btn btn-primary btn-sm");
    			button.disabled = /*submittingData*/ ctx[1];
    			add_location(button, file$5, 101, 32, 4300);
    			attr_dev(div1, "class", "mb-1 mt-3");
    			add_location(div1, file$5, 100, 28, 4243);
    			attr_dev(div2, "class", "content-color colu colu-l-9 h-75 my-2 p-3");
    			add_location(div2, file$5, 91, 24, 3646);
    			attr_dev(div3, "class", "d-flex flex-wrap mt-3 w-100 justify-content-between");
    			add_location(div3, file$5, 82, 20, 2879);
    			attr_dev(div4, "class", "container");
    			add_location(div4, file$5, 81, 16, 2834);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div4, anchor);
    			append_dev(div4, div3);
    			append_dev(div3, div0);
    			append_dev(div0, ul);
    			append_dev(ul, li0);
    			append_dev(li0, a0);
    			append_dev(ul, t1);
    			append_dev(ul, li1);
    			append_dev(li1, a1);
    			append_dev(ul, t3);
    			append_dev(ul, li2);
    			append_dev(li2, a2);
    			append_dev(div3, t5);
    			append_dev(div3, div2);
    			if_blocks[current_block_type_index].m(div2, null);
    			append_dev(div2, t6);
    			append_dev(div2, div1);
    			append_dev(div1, button);
    			append_dev(button, span);
    			append_dev(button, t7);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(a0, "click", prevent_default(/*click_handler*/ ctx[8]), false, true, false, false),
    					listen_dev(a1, "click", prevent_default(/*click_handler_1*/ ctx[9]), false, true, false, false),
    					listen_dev(a2, "click", prevent_default(/*click_handler_2*/ ctx[10]), false, true, false, false),
    					listen_dev(button, "click", /*updateSettings*/ ctx[6], false, false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (!current || dirty & /*activeTab*/ 1) {
    				toggle_class(a0, "active-link", /*activeTab*/ ctx[0] === 0);
    			}

    			if (!current || dirty & /*activeTab*/ 1) {
    				toggle_class(a1, "active-link", /*activeTab*/ ctx[0] === 1);
    			}

    			if (!current || dirty & /*activeTab*/ 1) {
    				toggle_class(a2, "active-link", /*activeTab*/ ctx[0] === 2);
    			}

    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type_1(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				} else {
    					if_block.p(ctx, dirty);
    				}

    				transition_in(if_block, 1);
    				if_block.m(div2, t6);
    			}

    			if (!current || dirty & /*submittingData*/ 2) {
    				toggle_class(span, "d-none", !/*submittingData*/ ctx[1]);
    			}

    			if (!current || dirty & /*submittingData*/ 2) {
    				prop_dev(button, "disabled", /*submittingData*/ ctx[1]);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div4);
    			if_blocks[current_block_type_index].d();
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$3.name,
    		type: "else",
    		source: "(81:12) {:else}",
    		ctx
    	});

    	return block;
    }

    // (79:51) 
    function create_if_block_1$3(ctx) {
    	let loadingerror;
    	let current;

    	loadingerror = new LoadingError({
    			props: {
    				message: "" + (/*errorMessage*/ ctx[3] + ",")
    			},
    			$$inline: true
    		});

    	loadingerror.$on("click", /*fetchData*/ ctx[7]);

    	const block = {
    		c: function create() {
    			create_component(loadingerror.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(loadingerror, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const loadingerror_changes = {};
    			if (dirty & /*errorMessage*/ 8) loadingerror_changes.message = "" + (/*errorMessage*/ ctx[3] + ",");
    			loadingerror.$set(loadingerror_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(loadingerror.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(loadingerror.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(loadingerror, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$3.name,
    		type: "if",
    		source: "(79:51) ",
    		ctx
    	});

    	return block;
    }

    // (77:12) {#if state == NetworkStates.loading}
    function create_if_block$3(ctx) {
    	let spinkit;
    	let current;
    	spinkit = new Spinkit({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(spinkit.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(spinkit, target, anchor);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(spinkit.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(spinkit.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(spinkit, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$3.name,
    		type: "if",
    		source: "(77:12) {#if state == NetworkStates.loading}",
    		ctx
    	});

    	return block;
    }

    // (97:28) {:else}
    function create_else_block_1(ctx) {
    	let security;
    	let updating_address;
    	let updating_mobile;
    	let updating_email;
    	let current;

    	function security_address_binding(value) {
    		/*security_address_binding*/ ctx[14](value);
    	}

    	function security_mobile_binding(value) {
    		/*security_mobile_binding*/ ctx[15](value);
    	}

    	function security_email_binding(value) {
    		/*security_email_binding*/ ctx[16](value);
    	}

    	let security_props = {};

    	if (/*settings*/ ctx[4].address !== void 0) {
    		security_props.address = /*settings*/ ctx[4].address;
    	}

    	if (/*settings*/ ctx[4].mobile !== void 0) {
    		security_props.mobile = /*settings*/ ctx[4].mobile;
    	}

    	if (/*settings*/ ctx[4].email !== void 0) {
    		security_props.email = /*settings*/ ctx[4].email;
    	}

    	security = new Security({ props: security_props, $$inline: true });
    	binding_callbacks.push(() => bind(security, 'address', security_address_binding));
    	binding_callbacks.push(() => bind(security, 'mobile', security_mobile_binding));
    	binding_callbacks.push(() => bind(security, 'email', security_email_binding));

    	const block = {
    		c: function create() {
    			create_component(security.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(security, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const security_changes = {};

    			if (!updating_address && dirty & /*settings*/ 16) {
    				updating_address = true;
    				security_changes.address = /*settings*/ ctx[4].address;
    				add_flush_callback(() => updating_address = false);
    			}

    			if (!updating_mobile && dirty & /*settings*/ 16) {
    				updating_mobile = true;
    				security_changes.mobile = /*settings*/ ctx[4].mobile;
    				add_flush_callback(() => updating_mobile = false);
    			}

    			if (!updating_email && dirty & /*settings*/ 16) {
    				updating_email = true;
    				security_changes.email = /*settings*/ ctx[4].email;
    				add_flush_callback(() => updating_email = false);
    			}

    			security.$set(security_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(security.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(security.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(security, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block_1.name,
    		type: "else",
    		source: "(97:28) {:else}",
    		ctx
    	});

    	return block;
    }

    // (95:53) 
    function create_if_block_3(ctx) {
    	let general;
    	let updating_currency;
    	let updating_language;
    	let current;

    	function general_currency_binding(value) {
    		/*general_currency_binding*/ ctx[12](value);
    	}

    	function general_language_binding(value) {
    		/*general_language_binding*/ ctx[13](value);
    	}

    	let general_props = {};

    	if (/*settings*/ ctx[4].currency !== void 0) {
    		general_props.currency = /*settings*/ ctx[4].currency;
    	}

    	if (/*settings*/ ctx[4].language !== void 0) {
    		general_props.language = /*settings*/ ctx[4].language;
    	}

    	general = new General({ props: general_props, $$inline: true });
    	binding_callbacks.push(() => bind(general, 'currency', general_currency_binding));
    	binding_callbacks.push(() => bind(general, 'language', general_language_binding));

    	const block = {
    		c: function create() {
    			create_component(general.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(general, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const general_changes = {};

    			if (!updating_currency && dirty & /*settings*/ 16) {
    				updating_currency = true;
    				general_changes.currency = /*settings*/ ctx[4].currency;
    				add_flush_callback(() => updating_currency = false);
    			}

    			if (!updating_language && dirty & /*settings*/ 16) {
    				updating_language = true;
    				general_changes.language = /*settings*/ ctx[4].language;
    				add_flush_callback(() => updating_language = false);
    			}

    			general.$set(general_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(general.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(general.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(general, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_3.name,
    		type: "if",
    		source: "(95:53) ",
    		ctx
    	});

    	return block;
    }

    // (93:28) {#if activeTab == 2}
    function create_if_block_2(ctx) {
    	let support;
    	let updating_notification;
    	let current;

    	function support_notification_binding(value) {
    		/*support_notification_binding*/ ctx[11](value);
    	}

    	let support_props = {};

    	if (/*settings*/ ctx[4].notification !== void 0) {
    		support_props.notification = /*settings*/ ctx[4].notification;
    	}

    	support = new Support({ props: support_props, $$inline: true });
    	binding_callbacks.push(() => bind(support, 'notification', support_notification_binding));

    	const block = {
    		c: function create() {
    			create_component(support.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(support, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const support_changes = {};

    			if (!updating_notification && dirty & /*settings*/ 16) {
    				updating_notification = true;
    				support_changes.notification = /*settings*/ ctx[4].notification;
    				add_flush_callback(() => updating_notification = false);
    			}

    			support.$set(support_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(support.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(support.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(support, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2.name,
    		type: "if",
    		source: "(93:28) {#if activeTab == 2}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$5(ctx) {
    	let div3;
    	let navigator;
    	let t0;
    	let div2;
    	let div1;
    	let header;
    	let t1;
    	let div0;
    	let h3;
    	let t3;
    	let current_block_type_index;
    	let if_block;
    	let t4;
    	let footer;
    	let current;

    	navigator = new DashboardNavigator({
    			props: { active: "settings" },
    			$$inline: true
    		});

    	header = new DashboardHeader({ $$inline: true });
    	const if_block_creators = [create_if_block$3, create_if_block_1$3, create_else_block$3];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*state*/ ctx[2] == NetworkStates.loading) return 0;
    		if (/*state*/ ctx[2] == NetworkStates.error) return 1;
    		return 2;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    	footer = new DashboardFooter({ $$inline: true });

    	const block = {
    		c: function create() {
    			div3 = element("div");
    			create_component(navigator.$$.fragment);
    			t0 = space();
    			div2 = element("div");
    			div1 = element("div");
    			create_component(header.$$.fragment);
    			t1 = space();
    			div0 = element("div");
    			h3 = element("h3");
    			h3.textContent = "Settings";
    			t3 = space();
    			if_block.c();
    			t4 = space();
    			create_component(footer.$$.fragment);
    			attr_dev(h3, "class", "mb-1");
    			set_style(h3, "color", "var(--white)");
    			add_location(h3, file$5, 74, 16, 2506);
    			attr_dev(div0, "class", "container-fluid");
    			add_location(div0, file$5, 73, 12, 2459);
    			attr_dev(div1, "id", "content");
    			attr_dev(div1, "class", "background-color");
    			add_location(div1, file$5, 70, 8, 2344);
    			attr_dev(div2, "class", "d-flex flex-column");
    			attr_dev(div2, "id", "content-wrapper");
    			add_location(div2, file$5, 69, 4, 2281);
    			attr_dev(div3, "id", "wrapper");
    			add_location(div3, file$5, 66, 0, 2192);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div3, anchor);
    			mount_component(navigator, div3, null);
    			append_dev(div3, t0);
    			append_dev(div3, div2);
    			append_dev(div2, div1);
    			mount_component(header, div1, null);
    			append_dev(div1, t1);
    			append_dev(div1, div0);
    			append_dev(div0, h3);
    			append_dev(div1, t3);
    			if_blocks[current_block_type_index].m(div1, null);
    			append_dev(div2, t4);
    			mount_component(footer, div2, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				} else {
    					if_block.p(ctx, dirty);
    				}

    				transition_in(if_block, 1);
    				if_block.m(div1, null);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(navigator.$$.fragment, local);
    			transition_in(header.$$.fragment, local);
    			transition_in(if_block);
    			transition_in(footer.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(navigator.$$.fragment, local);
    			transition_out(header.$$.fragment, local);
    			transition_out(if_block);
    			transition_out(footer.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div3);
    			destroy_component(navigator);
    			destroy_component(header);
    			if_blocks[current_block_type_index].d();
    			destroy_component(footer);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$5.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$5($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Settings', slots, []);
    	let activeTab = 0;
    	let submittingData = false;
    	let state;
    	let errorMessage;

    	function setTab(index) {
    		if (activeTab !== index) {
    			$$invalidate(0, activeTab = index);
    		}
    	}

    	let settings = {
    		notification: false,
    		currency: 'usd',
    		language: 'en',
    		address: '',
    		mobile: '',
    		email: ''
    	};

    	async function updateSettings() {
    		$$invalidate(1, submittingData = true);
    		let response = await fetchAndSendDataWithJson('/update-settings', settings, 'POST');

    		if (response.status) {
    			alertUser("", response.message, "success");
    			$$invalidate(4, settings = response.data);

    			basicDetails.update(d => {
    				d.currency = settings.currency;
    				return { ...d };
    			});

    			if (response.sent_otp) {
    				await updateEmail(settings.email);
    			}
    		} else {
    			alertUser("", response.message, "error");
    		}

    		$$invalidate(1, submittingData = false);
    	}

    	async function fetchData() {
    		$$invalidate(2, state = NetworkStates.loading);
    		let result = await fetchAndSendDataWithJson("/settings");

    		if (result.status) {
    			$$invalidate(4, settings = result.data);
    			$$invalidate(2, state = NetworkStates.loaded);
    		} else {
    			$$invalidate(3, errorMessage = result.message);
    			$$invalidate(2, state = NetworkStates.error);
    		}
    	}

    	onMount(fetchData);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Settings> was created with unknown prop '${key}'`);
    	});

    	const click_handler = () => {
    		setTab(0);
    	};

    	const click_handler_1 = () => {
    		setTab(1);
    	};

    	const click_handler_2 = () => {
    		setTab(2);
    	};

    	function support_notification_binding(value) {
    		if ($$self.$$.not_equal(settings.notification, value)) {
    			settings.notification = value;
    			$$invalidate(4, settings);
    		}
    	}

    	function general_currency_binding(value) {
    		if ($$self.$$.not_equal(settings.currency, value)) {
    			settings.currency = value;
    			$$invalidate(4, settings);
    		}
    	}

    	function general_language_binding(value) {
    		if ($$self.$$.not_equal(settings.language, value)) {
    			settings.language = value;
    			$$invalidate(4, settings);
    		}
    	}

    	function security_address_binding(value) {
    		if ($$self.$$.not_equal(settings.address, value)) {
    			settings.address = value;
    			$$invalidate(4, settings);
    		}
    	}

    	function security_mobile_binding(value) {
    		if ($$self.$$.not_equal(settings.mobile, value)) {
    			settings.mobile = value;
    			$$invalidate(4, settings);
    		}
    	}

    	function security_email_binding(value) {
    		if ($$self.$$.not_equal(settings.email, value)) {
    			settings.email = value;
    			$$invalidate(4, settings);
    		}
    	}

    	$$self.$capture_state = () => ({
    		Footer: DashboardFooter,
    		Navigator: DashboardNavigator,
    		Header: DashboardHeader,
    		Support,
    		General,
    		Security,
    		LoadingError,
    		Spinkit,
    		fetchAndSendDataWithJson,
    		NetworkStates,
    		alertUser,
    		basicDetails,
    		updateEmail,
    		onMount,
    		activeTab,
    		submittingData,
    		state,
    		errorMessage,
    		setTab,
    		settings,
    		updateSettings,
    		fetchData
    	});

    	$$self.$inject_state = $$props => {
    		if ('activeTab' in $$props) $$invalidate(0, activeTab = $$props.activeTab);
    		if ('submittingData' in $$props) $$invalidate(1, submittingData = $$props.submittingData);
    		if ('state' in $$props) $$invalidate(2, state = $$props.state);
    		if ('errorMessage' in $$props) $$invalidate(3, errorMessage = $$props.errorMessage);
    		if ('settings' in $$props) $$invalidate(4, settings = $$props.settings);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		activeTab,
    		submittingData,
    		state,
    		errorMessage,
    		settings,
    		setTab,
    		updateSettings,
    		fetchData,
    		click_handler,
    		click_handler_1,
    		click_handler_2,
    		support_notification_binding,
    		general_currency_binding,
    		general_language_binding,
    		security_address_binding,
    		security_mobile_binding,
    		security_email_binding
    	];
    }

    class Settings extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$5, create_fragment$5, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Settings",
    			options,
    			id: create_fragment$5.name
    		});
    	}
    }

    /* src\components\IDSubmission.svelte generated by Svelte v3.59.2 */
    const file$4 = "src\\components\\IDSubmission.svelte";

    function get_each_context(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[7] = list[i];
    	return child_ctx;
    }

    // (58:24) {#each idTypes as type}
    function create_each_block(ctx) {
    	let option;
    	let t_value = transformIDType(/*type*/ ctx[7]) + "";
    	let t;

    	const block = {
    		c: function create() {
    			option = element("option");
    			t = text(t_value);
    			option.__value = /*type*/ ctx[7];
    			option.value = option.__value;
    			add_location(option, file$4, 58, 28, 2406);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, option, anchor);
    			append_dev(option, t);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(option);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block.name,
    		type: "each",
    		source: "(58:24) {#each idTypes as type}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$4(ctx) {
    	let div10;
    	let div9;
    	let h6;
    	let t1;
    	let h2;
    	let t3;
    	let p0;
    	let t5;
    	let form;
    	let div1;
    	let p1;
    	let t7;
    	let div0;
    	let select;
    	let t8;
    	let div3;
    	let label;
    	let t10;
    	let input;
    	let t11;
    	let div2;
    	let t12;
    	let div6;
    	let div4;
    	let button0;
    	let t14;
    	let div5;
    	let embed0;
    	let embed0_src_value;
    	let t15;
    	let span;
    	let t16;
    	let embed1;
    	let embed1_src_value;
    	let t17;
    	let div7;
    	let button1;
    	let t19;
    	let div8;
    	let mounted;
    	let dispose;
    	let each_value = /*idTypes*/ ctx[4];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			div10 = element("div");
    			div9 = element("div");
    			h6 = element("h6");
    			h6.textContent = "Verification failed";
    			t1 = space();
    			h2 = element("h2");
    			h2.textContent = "Verify your identity";
    			t3 = space();
    			p0 = element("p");
    			p0.textContent = "Please upload a clear front and back image of your ID";
    			t5 = space();
    			form = element("form");
    			div1 = element("div");
    			p1 = element("p");
    			p1.textContent = "Select ID Type";
    			t7 = space();
    			div0 = element("div");
    			select = element("select");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t8 = space();
    			div3 = element("div");
    			label = element("label");
    			label.textContent = "Upload ID";
    			t10 = space();
    			input = element("input");
    			t11 = space();
    			div2 = element("div");
    			t12 = space();
    			div6 = element("div");
    			div4 = element("div");
    			button0 = element("button");
    			button0.textContent = "Reset";
    			t14 = space();
    			div5 = element("div");
    			embed0 = element("embed");
    			t15 = space();
    			span = element("span");
    			t16 = space();
    			embed1 = element("embed");
    			t17 = space();
    			div7 = element("div");
    			button1 = element("button");
    			button1.textContent = "Submit for Verification";
    			t19 = space();
    			div8 = element("div");
    			div8.textContent = "Your ID has been successfully submitted for verification!";
    			attr_dev(h6, "class", "text-danger mb-2 text-center");
    			toggle_class(h6, "d-none", /*status*/ ctx[0] != user_verification_status.failed);
    			add_location(h6, file$4, 49, 8, 1753);
    			attr_dev(h2, "class", "svelte-ef10dw");
    			add_location(h2, file$4, 50, 8, 1885);
    			attr_dev(p0, "class", "svelte-ef10dw");
    			add_location(p0, file$4, 51, 8, 1924);
    			attr_dev(p1, "class", "svelte-ef10dw");
    			add_location(p1, file$4, 54, 16, 2130);
    			attr_dev(select, "class", "form-select form-select-sm");
    			attr_dev(select, "aria-label", ".form-select-sm example");
    			attr_dev(select, "name", "id");
    			attr_dev(select, "id", "id");
    			if (/*idType*/ ctx[2] === void 0) add_render_callback(() => /*select_change_handler*/ ctx[6].call(select));
    			add_location(select, file$4, 56, 20, 2209);
    			attr_dev(div0, "class", "ms-3");
    			add_location(div0, file$4, 55, 16, 2169);
    			attr_dev(div1, "class", "input-group svelte-ef10dw");
    			add_location(div1, file$4, 53, 12, 2087);
    			attr_dev(label, "for", "idUpload");
    			attr_dev(label, "class", "svelte-ef10dw");
    			add_location(label, file$4, 64, 16, 2626);
    			attr_dev(input, "type", "file");
    			attr_dev(input, "id", "idUpload");
    			attr_dev(input, "name", "file");
    			attr_dev(input, "accept", "image/* application/pdf");
    			input.required = true;
    			attr_dev(input, "class", "svelte-ef10dw");
    			add_location(input, file$4, 65, 16, 2683);
    			attr_dev(div2, "class", "error svelte-ef10dw");
    			attr_dev(div2, "id", "fileError");
    			add_location(div2, file$4, 66, 16, 2815);
    			attr_dev(div3, "class", "input-group svelte-ef10dw");
    			add_location(div3, file$4, 63, 12, 2583);
    			attr_dev(button0, "type", "reset");
    			attr_dev(button0, "class", "reset svelte-ef10dw");
    			add_location(button0, file$4, 70, 20, 2972);
    			add_location(div4, file$4, 69, 16, 2945);
    			if (!src_url_equal(embed0.src, embed0_src_value = /*objSrc1*/ ctx[1])) attr_dev(embed0, "src", embed0_src_value);
    			attr_dev(embed0, "width", "100");
    			attr_dev(embed0, "height", "100");
    			add_location(embed0, file$4, 73, 20, 3090);
    			attr_dev(span, "class", "me-3");
    			add_location(span, file$4, 74, 20, 3158);
    			if (!src_url_equal(embed1.src, embed1_src_value = /*objSrc2*/ ctx[3])) attr_dev(embed1, "src", embed1_src_value);
    			attr_dev(embed1, "width", "100");
    			attr_dev(embed1, "height", "100");
    			add_location(embed1, file$4, 75, 20, 3206);
    			add_location(div5, file$4, 72, 16, 3063);
    			attr_dev(div6, "class", "preview-container d-none svelte-ef10dw");
    			add_location(div6, file$4, 68, 12, 2889);
    			attr_dev(button1, "type", "submit");
    			attr_dev(button1, "class", "submit-button svelte-ef10dw");
    			add_location(button1, file$4, 80, 16, 3355);
    			attr_dev(div7, "class", "input-group svelte-ef10dw");
    			add_location(div7, file$4, 79, 12, 3312);
    			attr_dev(form, "id", "idForm");
    			attr_dev(form, "method", "POST");
    			attr_dev(form, "enctype", "multipart/form-data");
    			attr_dev(form, "action", "/verify");
    			add_location(form, file$4, 52, 8, 1994);
    			attr_dev(div8, "class", "success-message svelte-ef10dw");
    			attr_dev(div8, "id", "successMessage");
    			add_location(div8, file$4, 85, 8, 3611);
    			attr_dev(div9, "class", "container svelte-ef10dw");
    			add_location(div9, file$4, 48, 4, 1720);
    			attr_dev(div10, "class", "body svelte-ef10dw");
    			add_location(div10, file$4, 47, 0, 1696);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div10, anchor);
    			append_dev(div10, div9);
    			append_dev(div9, h6);
    			append_dev(div9, t1);
    			append_dev(div9, h2);
    			append_dev(div9, t3);
    			append_dev(div9, p0);
    			append_dev(div9, t5);
    			append_dev(div9, form);
    			append_dev(form, div1);
    			append_dev(div1, p1);
    			append_dev(div1, t7);
    			append_dev(div1, div0);
    			append_dev(div0, select);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				if (each_blocks[i]) {
    					each_blocks[i].m(select, null);
    				}
    			}

    			select_option(select, /*idType*/ ctx[2], true);
    			append_dev(form, t8);
    			append_dev(form, div3);
    			append_dev(div3, label);
    			append_dev(div3, t10);
    			append_dev(div3, input);
    			append_dev(div3, t11);
    			append_dev(div3, div2);
    			append_dev(form, t12);
    			append_dev(form, div6);
    			append_dev(div6, div4);
    			append_dev(div4, button0);
    			append_dev(div6, t14);
    			append_dev(div6, div5);
    			append_dev(div5, embed0);
    			append_dev(div5, t15);
    			append_dev(div5, span);
    			append_dev(div5, t16);
    			append_dev(div5, embed1);
    			append_dev(form, t17);
    			append_dev(form, div7);
    			append_dev(div7, button1);
    			append_dev(div9, t19);
    			append_dev(div9, div8);

    			if (!mounted) {
    				dispose = [
    					listen_dev(select, "change", /*select_change_handler*/ ctx[6]),
    					listen_dev(input, "change", /*onFileSelected*/ ctx[5], false, false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*status, user_verification_status*/ 1) {
    				toggle_class(h6, "d-none", /*status*/ ctx[0] != user_verification_status.failed);
    			}

    			if (dirty & /*idTypes, transformIDType*/ 16) {
    				each_value = /*idTypes*/ ctx[4];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(select, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}

    			if (dirty & /*idType, idTypes*/ 20) {
    				select_option(select, /*idType*/ ctx[2]);
    			}

    			if (dirty & /*objSrc1*/ 2 && !src_url_equal(embed0.src, embed0_src_value = /*objSrc1*/ ctx[1])) {
    				attr_dev(embed0, "src", embed0_src_value);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div10);
    			destroy_each(each_blocks, detaching);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$4.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function transformIDType(value) {
    	if (value === "passport") {
    		return "International Passport";
    	} else if (value === "national") {
    		return "National ID";
    	} else {
    		return "Driver's License";
    	}
    }

    function instance$4($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('IDSubmission', slots, []);
    	let { status } = $$props;
    	let objSrc1;
    	let objSrc2;
    	const idTypes = ["passport", "national", "license"];
    	let idType = idTypes[0];

    	function onFileSelected(event) {
    		$$invalidate(1, objSrc1 = URL.createObjectURL(event.target.files[0]));
    	}

    	$$self.$$.on_mount.push(function () {
    		if (status === undefined && !('status' in $$props || $$self.$$.bound[$$self.$$.props['status']])) {
    			console.warn("<IDSubmission> was created without expected prop 'status'");
    		}
    	});

    	const writable_props = ['status'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<IDSubmission> was created with unknown prop '${key}'`);
    	});

    	function select_change_handler() {
    		idType = select_value(this);
    		$$invalidate(2, idType);
    		$$invalidate(4, idTypes);
    	}

    	$$self.$$set = $$props => {
    		if ('status' in $$props) $$invalidate(0, status = $$props.status);
    	};

    	$$self.$capture_state = () => ({
    		user_verification_status,
    		status,
    		objSrc1,
    		objSrc2,
    		idTypes,
    		idType,
    		transformIDType,
    		onFileSelected
    	});

    	$$self.$inject_state = $$props => {
    		if ('status' in $$props) $$invalidate(0, status = $$props.status);
    		if ('objSrc1' in $$props) $$invalidate(1, objSrc1 = $$props.objSrc1);
    		if ('objSrc2' in $$props) $$invalidate(3, objSrc2 = $$props.objSrc2);
    		if ('idType' in $$props) $$invalidate(2, idType = $$props.idType);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		status,
    		objSrc1,
    		idType,
    		objSrc2,
    		idTypes,
    		onFileSelected,
    		select_change_handler
    	];
    }

    class IDSubmission extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$4, create_fragment$4, safe_not_equal, { status: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "IDSubmission",
    			options,
    			id: create_fragment$4.name
    		});
    	}

    	get status() {
    		throw new Error("<IDSubmission>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set status(value) {
    		throw new Error("<IDSubmission>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\components\verification\ongoing.svelte generated by Svelte v3.59.2 */

    const file$3 = "src\\components\\verification\\ongoing.svelte";

    function create_fragment$3(ctx) {
    	let div2;
    	let div1;
    	let div0;
    	let svg;
    	let circle;
    	let animateTransform;
    	let t0;
    	let h1;
    	let t2;
    	let p;

    	const block = {
    		c: function create() {
    			div2 = element("div");
    			div1 = element("div");
    			div0 = element("div");
    			svg = svg_element("svg");
    			circle = svg_element("circle");
    			animateTransform = svg_element("animateTransform");
    			t0 = space();
    			h1 = element("h1");
    			h1.textContent = "Verification Ongoing";
    			t2 = space();
    			p = element("p");
    			p.textContent = "We will notify soon when a decision is made";
    			attr_dev(animateTransform, "attributeName", "transform");
    			attr_dev(animateTransform, "type", "rotate");
    			attr_dev(animateTransform, "repeatCount", "indefinite");
    			attr_dev(animateTransform, "dur", "1s");
    			attr_dev(animateTransform, "keyTimes", "0;1");
    			attr_dev(animateTransform, "values", "0 50 50;360 50 50");
    			add_location(animateTransform, file$3, 6, 18, 499);
    			attr_dev(circle, "cx", "50");
    			attr_dev(circle, "cy", "50");
    			attr_dev(circle, "fill", "none");
    			attr_dev(circle, "stroke", "#1cc88a");
    			attr_dev(circle, "stroke-width", "10");
    			attr_dev(circle, "r", "35");
    			attr_dev(circle, "stroke-dasharray", "164.93361431346415 56.97787143782138");
    			add_location(circle, file$3, 5, 16, 345);
    			attr_dev(svg, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg, "xmlns:xlink", "http://www.w3.org/1999/xlink");
    			set_style(svg, "margin", "auto");
    			set_style(svg, "background", "none");
    			set_style(svg, "display", "block");
    			attr_dev(svg, "width", "100px");
    			attr_dev(svg, "height", "100px");
    			attr_dev(svg, "viewBox", "0 0 100 100");
    			attr_dev(svg, "preserveAspectRatio", "xMidYMid");
    			attr_dev(svg, "class", "svelte-8w96ef");
    			add_location(svg, file$3, 4, 12, 111);
    			attr_dev(div0, "class", "spinner svelte-8w96ef");
    			add_location(div0, file$3, 3, 8, 76);
    			attr_dev(h1, "class", "svelte-8w96ef");
    			add_location(h1, file$3, 10, 8, 727);
    			attr_dev(p, "class", "svelte-8w96ef");
    			add_location(p, file$3, 11, 8, 766);
    			attr_dev(div1, "class", "container svelte-8w96ef");
    			add_location(div1, file$3, 2, 4, 43);
    			attr_dev(div2, "class", "body background-color svelte-8w96ef");
    			add_location(div2, file$3, 1, 0, 2);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div2, anchor);
    			append_dev(div2, div1);
    			append_dev(div1, div0);
    			append_dev(div0, svg);
    			append_dev(svg, circle);
    			append_dev(circle, animateTransform);
    			append_dev(div1, t0);
    			append_dev(div1, h1);
    			append_dev(div1, t2);
    			append_dev(div1, p);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div2);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$3.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$3($$self, $$props) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Ongoing', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Ongoing> was created with unknown prop '${key}'`);
    	});

    	return [];
    }

    class Ongoing extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$3, create_fragment$3, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Ongoing",
    			options,
    			id: create_fragment$3.name
    		});
    	}
    }

    /* src\pages\dashboard\IDVerification.svelte generated by Svelte v3.59.2 */
    const file$2 = "src\\pages\\dashboard\\IDVerification.svelte";

    // (23:0) {:else}
    function create_else_block$2(ctx) {
    	let div2;
    	let div0;
    	let a;
    	let t0;
    	let i;
    	let t1;
    	let div1;
    	let idsubmission;
    	let current;

    	idsubmission = new IDSubmission({
    			props: { status: /*status*/ ctx[0] },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			div2 = element("div");
    			div0 = element("div");
    			a = element("a");
    			t0 = text("Back ");
    			i = element("i");
    			t1 = space();
    			div1 = element("div");
    			create_component(idsubmission.$$.fragment);
    			attr_dev(i, "class", "fas fa-sign-in-alt");
    			add_location(i, file$2, 24, 154, 1436);
    			set_style(a, "float", "right");
    			set_style(a, "font-size", "x-large");
    			set_style(a, "font-weight", "800");
    			set_style(a, "text-decoration", "none");
    			set_style(a, "color", "var(--white)");
    			attr_dev(a, "href", "/logout");
    			add_location(a, file$2, 24, 26, 1308);
    			attr_dev(div0, "class", "px-3");
    			add_location(div0, file$2, 24, 8, 1290);
    			attr_dev(div1, "class", "d-flex justify-content-center align-items-center w-100");
    			set_style(div1, "height", "90%");
    			add_location(div1, file$2, 25, 8, 1490);
    			attr_dev(div2, "class", "h-100 w-100 py-2 background-color");
    			add_location(div2, file$2, 23, 4, 1233);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div2, anchor);
    			append_dev(div2, div0);
    			append_dev(div0, a);
    			append_dev(a, t0);
    			append_dev(a, i);
    			append_dev(div2, t1);
    			append_dev(div2, div1);
    			mount_component(idsubmission, div1, null);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const idsubmission_changes = {};
    			if (dirty & /*status*/ 1) idsubmission_changes.status = /*status*/ ctx[0];
    			idsubmission.$set(idsubmission_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(idsubmission.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(idsubmission.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div2);
    			destroy_component(idsubmission);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$2.name,
    		type: "else",
    		source: "(23:0) {:else}",
    		ctx
    	});

    	return block;
    }

    // (16:55) 
    function create_if_block_1$2(ctx) {
    	let div2;
    	let div0;
    	let a;
    	let t0;
    	let i;
    	let t1;
    	let div1;
    	let ongoing;
    	let current;
    	ongoing = new Ongoing({ $$inline: true });

    	const block = {
    		c: function create() {
    			div2 = element("div");
    			div0 = element("div");
    			a = element("a");
    			t0 = text("Back ");
    			i = element("i");
    			t1 = space();
    			div1 = element("div");
    			create_component(ongoing.$$.fragment);
    			attr_dev(i, "class", "fas fa-sign-in-alt");
    			add_location(i, file$2, 17, 154, 1022);
    			set_style(a, "float", "right");
    			set_style(a, "font-size", "x-large");
    			set_style(a, "font-weight", "800");
    			set_style(a, "text-decoration", "none");
    			set_style(a, "color", "var(--white)");
    			attr_dev(a, "href", "/logout");
    			add_location(a, file$2, 17, 26, 894);
    			attr_dev(div0, "class", "px-3");
    			add_location(div0, file$2, 17, 8, 876);
    			attr_dev(div1, "class", "d-flex justify-content-center align-items-center w-100");
    			set_style(div1, "height", "90%");
    			add_location(div1, file$2, 18, 8, 1076);
    			attr_dev(div2, "class", "h-100 w-100 py-2 background-color");
    			add_location(div2, file$2, 16, 4, 819);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div2, anchor);
    			append_dev(div2, div0);
    			append_dev(div0, a);
    			append_dev(a, t0);
    			append_dev(a, i);
    			append_dev(div2, t1);
    			append_dev(div2, div1);
    			mount_component(ongoing, div1, null);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(ongoing.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(ongoing.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div2);
    			destroy_component(ongoing);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$2.name,
    		type: "if",
    		source: "(16:55) ",
    		ctx
    	});

    	return block;
    }

    // (9:0) {#if status == user_verification_status.unverified}
    function create_if_block$2(ctx) {
    	let div2;
    	let div0;
    	let a;
    	let t0;
    	let i;
    	let t1;
    	let div1;
    	let idsubmission;
    	let current;

    	idsubmission = new IDSubmission({
    			props: { status: /*status*/ ctx[0] },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			div2 = element("div");
    			div0 = element("div");
    			a = element("a");
    			t0 = text("Back ");
    			i = element("i");
    			t1 = space();
    			div1 = element("div");
    			create_component(idsubmission.$$.fragment);
    			attr_dev(i, "class", "fas fa-sign-in-alt");
    			add_location(i, file$2, 10, 158, 534);
    			set_style(a, "float", "right");
    			set_style(a, "font-size", "x-large");
    			set_style(a, "font-weight", "800");
    			set_style(a, "text-decoration", "none");
    			set_style(a, "color", "var(--white)");
    			attr_dev(a, "href", "/logout");
    			add_location(a, file$2, 10, 30, 406);
    			attr_dev(div0, "class", "px-3");
    			add_location(div0, file$2, 10, 12, 388);
    			attr_dev(div1, "class", "d-flex justify-content-center align-items-center w-100");
    			set_style(div1, "height", "90%");
    			add_location(div1, file$2, 11, 12, 592);
    			attr_dev(div2, "class", "h-100 w-100 py-2 background-color");
    			add_location(div2, file$2, 9, 4, 327);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div2, anchor);
    			append_dev(div2, div0);
    			append_dev(div0, a);
    			append_dev(a, t0);
    			append_dev(a, i);
    			append_dev(div2, t1);
    			append_dev(div2, div1);
    			mount_component(idsubmission, div1, null);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const idsubmission_changes = {};
    			if (dirty & /*status*/ 1) idsubmission_changes.status = /*status*/ ctx[0];
    			idsubmission.$set(idsubmission_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(idsubmission.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(idsubmission.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div2);
    			destroy_component(idsubmission);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$2.name,
    		type: "if",
    		source: "(9:0) {#if status == user_verification_status.unverified}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$2(ctx) {
    	let current_block_type_index;
    	let if_block;
    	let if_block_anchor;
    	let current;
    	const if_block_creators = [create_if_block$2, create_if_block_1$2, create_else_block$2];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*status*/ ctx[0] == user_verification_status.unverified) return 0;
    		if (/*status*/ ctx[0] == user_verification_status.verifying) return 1;
    		return 2;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block = {
    		c: function create() {
    			if_block.c();
    			if_block_anchor = empty();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if_blocks[current_block_type_index].m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				} else {
    					if_block.p(ctx, dirty);
    				}

    				transition_in(if_block, 1);
    				if_block.m(if_block_anchor.parentNode, if_block_anchor);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if_blocks[current_block_type_index].d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$2.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$2($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('IDVerification', slots, []);
    	let { status } = $$props;

    	$$self.$$.on_mount.push(function () {
    		if (status === undefined && !('status' in $$props || $$self.$$.bound[$$self.$$.props['status']])) {
    			console.warn("<IDVerification> was created without expected prop 'status'");
    		}
    	});

    	const writable_props = ['status'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<IDVerification> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('status' in $$props) $$invalidate(0, status = $$props.status);
    	};

    	$$self.$capture_state = () => ({
    		IdSubmission: IDSubmission,
    		Ongoing,
    		user_verification_status,
    		status
    	});

    	$$self.$inject_state = $$props => {
    		if ('status' in $$props) $$invalidate(0, status = $$props.status);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [status];
    }

    class IDVerification extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$2, create_fragment$2, safe_not_equal, { status: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "IDVerification",
    			options,
    			id: create_fragment$2.name
    		});
    	}

    	get status() {
    		throw new Error("<IDVerification>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set status(value) {
    		throw new Error("<IDVerification>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\pages\dashboard\Purchase.svelte generated by Svelte v3.59.2 */
    const file$1 = "src\\pages\\dashboard\\Purchase.svelte";

    // (50:12) {:else}
    function create_else_block$1(ctx) {
    	let spinkit;
    	let current;
    	spinkit = new Spinkit({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(spinkit.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(spinkit, target, anchor);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(spinkit.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(spinkit.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(spinkit, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$1.name,
    		type: "else",
    		source: "(50:12) {:else}",
    		ctx
    	});

    	return block;
    }

    // (48:52) 
    function create_if_block_1$1(ctx) {
    	let loadingerror;
    	let current;

    	loadingerror = new LoadingError({
    			props: { message: /*errorMessage*/ ctx[1] },
    			$$inline: true
    		});

    	loadingerror.$on("click", /*fetchData*/ ctx[3]);

    	const block = {
    		c: function create() {
    			create_component(loadingerror.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(loadingerror, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const loadingerror_changes = {};
    			if (dirty & /*errorMessage*/ 2) loadingerror_changes.message = /*errorMessage*/ ctx[1];
    			loadingerror.$set(loadingerror_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(loadingerror.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(loadingerror.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(loadingerror, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$1.name,
    		type: "if",
    		source: "(48:52) ",
    		ctx
    	});

    	return block;
    }

    // (41:12) {#if state === NetworkStates.loaded}
    function create_if_block$1(ctx) {
    	let div1;
    	let div0;
    	let h3;
    	let t1;
    	let plans;
    	let current;

    	plans = new Plans({
    			props: { balance: /*balance*/ ctx[2] },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			div0 = element("div");
    			h3 = element("h3");
    			h3.textContent = "Purchase Plan";
    			t1 = space();
    			create_component(plans.$$.fragment);
    			attr_dev(h3, "class", "mb-0");
    			set_style(h3, "color", "var(--semi-white)");
    			add_location(h3, file$1, 43, 20, 1607);
    			attr_dev(div0, "class", "justify-content-between align-items-center mb-4");
    			add_location(div0, file$1, 42, 16, 1524);
    			attr_dev(div1, "class", "container-fluid");
    			add_location(div1, file$1, 41, 12, 1477);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, div0);
    			append_dev(div0, h3);
    			append_dev(div1, t1);
    			mount_component(plans, div1, null);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const plans_changes = {};
    			if (dirty & /*balance*/ 4) plans_changes.balance = /*balance*/ ctx[2];
    			plans.$set(plans_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(plans.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(plans.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    			destroy_component(plans);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$1.name,
    		type: "if",
    		source: "(41:12) {#if state === NetworkStates.loaded}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$1(ctx) {
    	let div2;
    	let navigator;
    	let t0;
    	let div1;
    	let div0;
    	let header;
    	let t1;
    	let current_block_type_index;
    	let if_block;
    	let t2;
    	let footer;
    	let current;

    	navigator = new DashboardNavigator({
    			props: { active: "purchase" },
    			$$inline: true
    		});

    	header = new DashboardHeader({ $$inline: true });
    	const if_block_creators = [create_if_block$1, create_if_block_1$1, create_else_block$1];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*state*/ ctx[0] === NetworkStates.loaded) return 0;
    		if (/*state*/ ctx[0] === NetworkStates.error) return 1;
    		return 2;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    	footer = new DashboardFooter({ $$inline: true });

    	const block = {
    		c: function create() {
    			div2 = element("div");
    			create_component(navigator.$$.fragment);
    			t0 = space();
    			div1 = element("div");
    			div0 = element("div");
    			create_component(header.$$.fragment);
    			t1 = space();
    			if_block.c();
    			t2 = space();
    			create_component(footer.$$.fragment);
    			attr_dev(div0, "id", "content");
    			attr_dev(div0, "class", "background-color");
    			add_location(div0, file$1, 36, 8, 1270);
    			attr_dev(div1, "class", "d-flex flex-column");
    			attr_dev(div1, "id", "content-wrapper");
    			add_location(div1, file$1, 35, 4, 1207);
    			attr_dev(div2, "id", "wrapper");
    			add_location(div2, file$1, 32, 0, 1118);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div2, anchor);
    			mount_component(navigator, div2, null);
    			append_dev(div2, t0);
    			append_dev(div2, div1);
    			append_dev(div1, div0);
    			mount_component(header, div0, null);
    			append_dev(div0, t1);
    			if_blocks[current_block_type_index].m(div0, null);
    			append_dev(div1, t2);
    			mount_component(footer, div1, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				} else {
    					if_block.p(ctx, dirty);
    				}

    				transition_in(if_block, 1);
    				if_block.m(div0, null);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(navigator.$$.fragment, local);
    			transition_in(header.$$.fragment, local);
    			transition_in(if_block);
    			transition_in(footer.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(navigator.$$.fragment, local);
    			transition_out(header.$$.fragment, local);
    			transition_out(if_block);
    			transition_out(footer.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div2);
    			destroy_component(navigator);
    			destroy_component(header);
    			if_blocks[current_block_type_index].d();
    			destroy_component(footer);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$1.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$1($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Purchase', slots, []);
    	let state;
    	let errorMessage;
    	let balance;

    	const fetchData = async () => {
    		$$invalidate(0, state = NetworkStates.loading);
    		let result = await fetchAndSendDataWithJson("/purchase-plan");

    		if (result.status) {
    			$$invalidate(2, balance = result.data.balance);
    			$$invalidate(0, state = NetworkStates.loaded);
    		} else {
    			$$invalidate(1, errorMessage = result.message);
    			$$invalidate(0, state = NetworkStates.error);
    		}
    	};

    	onMount(() => {
    		fetchData();
    	});

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Purchase> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		Footer: DashboardFooter,
    		Navigator: DashboardNavigator,
    		Header: DashboardHeader,
    		Plans,
    		Spinkit,
    		LoadingError,
    		NetworkStates,
    		alertUser,
    		fetchAndSendDataWithJson,
    		transformPaymentValue,
    		basicDetails,
    		actualCurrency,
    		onMount,
    		state,
    		errorMessage,
    		balance,
    		fetchData
    	});

    	$$self.$inject_state = $$props => {
    		if ('state' in $$props) $$invalidate(0, state = $$props.state);
    		if ('errorMessage' in $$props) $$invalidate(1, errorMessage = $$props.errorMessage);
    		if ('balance' in $$props) $$invalidate(2, balance = $$props.balance);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [state, errorMessage, balance, fetchData];
    }

    class Purchase extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$1, create_fragment$1, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Purchase",
    			options,
    			id: create_fragment$1.name
    		});
    	}
    }

    var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

    function getDefaultExportFromCjs (x) {
    	return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x['default'] : x;
    }

    var page = {exports: {}};

    (function (module, exports) {
    	(function (global, factory) {
    		module.exports = factory() ;
    	}(commonjsGlobal, (function () {
    	var isarray = Array.isArray || function (arr) {
    	  return Object.prototype.toString.call(arr) == '[object Array]';
    	};

    	/**
    	 * Expose `pathToRegexp`.
    	 */
    	var pathToRegexp_1 = pathToRegexp;
    	var parse_1 = parse;
    	var compile_1 = compile;
    	var tokensToFunction_1 = tokensToFunction;
    	var tokensToRegExp_1 = tokensToRegExp;

    	/**
    	 * The main path matching regexp utility.
    	 *
    	 * @type {RegExp}
    	 */
    	var PATH_REGEXP = new RegExp([
    	  // Match escaped characters that would otherwise appear in future matches.
    	  // This allows the user to escape special characters that won't transform.
    	  '(\\\\.)',
    	  // Match Express-style parameters and un-named parameters with a prefix
    	  // and optional suffixes. Matches appear as:
    	  //
    	  // "/:test(\\d+)?" => ["/", "test", "\d+", undefined, "?", undefined]
    	  // "/route(\\d+)"  => [undefined, undefined, undefined, "\d+", undefined, undefined]
    	  // "/*"            => ["/", undefined, undefined, undefined, undefined, "*"]
    	  '([\\/.])?(?:(?:\\:(\\w+)(?:\\(((?:\\\\.|[^()])+)\\))?|\\(((?:\\\\.|[^()])+)\\))([+*?])?|(\\*))'
    	].join('|'), 'g');

    	/**
    	 * Parse a string for the raw tokens.
    	 *
    	 * @param  {String} str
    	 * @return {Array}
    	 */
    	function parse (str) {
    	  var tokens = [];
    	  var key = 0;
    	  var index = 0;
    	  var path = '';
    	  var res;

    	  while ((res = PATH_REGEXP.exec(str)) != null) {
    	    var m = res[0];
    	    var escaped = res[1];
    	    var offset = res.index;
    	    path += str.slice(index, offset);
    	    index = offset + m.length;

    	    // Ignore already escaped sequences.
    	    if (escaped) {
    	      path += escaped[1];
    	      continue
    	    }

    	    // Push the current path onto the tokens.
    	    if (path) {
    	      tokens.push(path);
    	      path = '';
    	    }

    	    var prefix = res[2];
    	    var name = res[3];
    	    var capture = res[4];
    	    var group = res[5];
    	    var suffix = res[6];
    	    var asterisk = res[7];

    	    var repeat = suffix === '+' || suffix === '*';
    	    var optional = suffix === '?' || suffix === '*';
    	    var delimiter = prefix || '/';
    	    var pattern = capture || group || (asterisk ? '.*' : '[^' + delimiter + ']+?');

    	    tokens.push({
    	      name: name || key++,
    	      prefix: prefix || '',
    	      delimiter: delimiter,
    	      optional: optional,
    	      repeat: repeat,
    	      pattern: escapeGroup(pattern)
    	    });
    	  }

    	  // Match any characters still remaining.
    	  if (index < str.length) {
    	    path += str.substr(index);
    	  }

    	  // If the path exists, push it onto the end.
    	  if (path) {
    	    tokens.push(path);
    	  }

    	  return tokens
    	}

    	/**
    	 * Compile a string to a template function for the path.
    	 *
    	 * @param  {String}   str
    	 * @return {Function}
    	 */
    	function compile (str) {
    	  return tokensToFunction(parse(str))
    	}

    	/**
    	 * Expose a method for transforming tokens into the path function.
    	 */
    	function tokensToFunction (tokens) {
    	  // Compile all the tokens into regexps.
    	  var matches = new Array(tokens.length);

    	  // Compile all the patterns before compilation.
    	  for (var i = 0; i < tokens.length; i++) {
    	    if (typeof tokens[i] === 'object') {
    	      matches[i] = new RegExp('^' + tokens[i].pattern + '$');
    	    }
    	  }

    	  return function (obj) {
    	    var path = '';
    	    var data = obj || {};

    	    for (var i = 0; i < tokens.length; i++) {
    	      var token = tokens[i];

    	      if (typeof token === 'string') {
    	        path += token;

    	        continue
    	      }

    	      var value = data[token.name];
    	      var segment;

    	      if (value == null) {
    	        if (token.optional) {
    	          continue
    	        } else {
    	          throw new TypeError('Expected "' + token.name + '" to be defined')
    	        }
    	      }

    	      if (isarray(value)) {
    	        if (!token.repeat) {
    	          throw new TypeError('Expected "' + token.name + '" to not repeat, but received "' + value + '"')
    	        }

    	        if (value.length === 0) {
    	          if (token.optional) {
    	            continue
    	          } else {
    	            throw new TypeError('Expected "' + token.name + '" to not be empty')
    	          }
    	        }

    	        for (var j = 0; j < value.length; j++) {
    	          segment = encodeURIComponent(value[j]);

    	          if (!matches[i].test(segment)) {
    	            throw new TypeError('Expected all "' + token.name + '" to match "' + token.pattern + '", but received "' + segment + '"')
    	          }

    	          path += (j === 0 ? token.prefix : token.delimiter) + segment;
    	        }

    	        continue
    	      }

    	      segment = encodeURIComponent(value);

    	      if (!matches[i].test(segment)) {
    	        throw new TypeError('Expected "' + token.name + '" to match "' + token.pattern + '", but received "' + segment + '"')
    	      }

    	      path += token.prefix + segment;
    	    }

    	    return path
    	  }
    	}

    	/**
    	 * Escape a regular expression string.
    	 *
    	 * @param  {String} str
    	 * @return {String}
    	 */
    	function escapeString (str) {
    	  return str.replace(/([.+*?=^!:${}()[\]|\/])/g, '\\$1')
    	}

    	/**
    	 * Escape the capturing group by escaping special characters and meaning.
    	 *
    	 * @param  {String} group
    	 * @return {String}
    	 */
    	function escapeGroup (group) {
    	  return group.replace(/([=!:$\/()])/g, '\\$1')
    	}

    	/**
    	 * Attach the keys as a property of the regexp.
    	 *
    	 * @param  {RegExp} re
    	 * @param  {Array}  keys
    	 * @return {RegExp}
    	 */
    	function attachKeys (re, keys) {
    	  re.keys = keys;
    	  return re
    	}

    	/**
    	 * Get the flags for a regexp from the options.
    	 *
    	 * @param  {Object} options
    	 * @return {String}
    	 */
    	function flags (options) {
    	  return options.sensitive ? '' : 'i'
    	}

    	/**
    	 * Pull out keys from a regexp.
    	 *
    	 * @param  {RegExp} path
    	 * @param  {Array}  keys
    	 * @return {RegExp}
    	 */
    	function regexpToRegexp (path, keys) {
    	  // Use a negative lookahead to match only capturing groups.
    	  var groups = path.source.match(/\((?!\?)/g);

    	  if (groups) {
    	    for (var i = 0; i < groups.length; i++) {
    	      keys.push({
    	        name: i,
    	        prefix: null,
    	        delimiter: null,
    	        optional: false,
    	        repeat: false,
    	        pattern: null
    	      });
    	    }
    	  }

    	  return attachKeys(path, keys)
    	}

    	/**
    	 * Transform an array into a regexp.
    	 *
    	 * @param  {Array}  path
    	 * @param  {Array}  keys
    	 * @param  {Object} options
    	 * @return {RegExp}
    	 */
    	function arrayToRegexp (path, keys, options) {
    	  var parts = [];

    	  for (var i = 0; i < path.length; i++) {
    	    parts.push(pathToRegexp(path[i], keys, options).source);
    	  }

    	  var regexp = new RegExp('(?:' + parts.join('|') + ')', flags(options));

    	  return attachKeys(regexp, keys)
    	}

    	/**
    	 * Create a path regexp from string input.
    	 *
    	 * @param  {String} path
    	 * @param  {Array}  keys
    	 * @param  {Object} options
    	 * @return {RegExp}
    	 */
    	function stringToRegexp (path, keys, options) {
    	  var tokens = parse(path);
    	  var re = tokensToRegExp(tokens, options);

    	  // Attach keys back to the regexp.
    	  for (var i = 0; i < tokens.length; i++) {
    	    if (typeof tokens[i] !== 'string') {
    	      keys.push(tokens[i]);
    	    }
    	  }

    	  return attachKeys(re, keys)
    	}

    	/**
    	 * Expose a function for taking tokens and returning a RegExp.
    	 *
    	 * @param  {Array}  tokens
    	 * @param  {Array}  keys
    	 * @param  {Object} options
    	 * @return {RegExp}
    	 */
    	function tokensToRegExp (tokens, options) {
    	  options = options || {};

    	  var strict = options.strict;
    	  var end = options.end !== false;
    	  var route = '';
    	  var lastToken = tokens[tokens.length - 1];
    	  var endsWithSlash = typeof lastToken === 'string' && /\/$/.test(lastToken);

    	  // Iterate over the tokens and create our regexp string.
    	  for (var i = 0; i < tokens.length; i++) {
    	    var token = tokens[i];

    	    if (typeof token === 'string') {
    	      route += escapeString(token);
    	    } else {
    	      var prefix = escapeString(token.prefix);
    	      var capture = token.pattern;

    	      if (token.repeat) {
    	        capture += '(?:' + prefix + capture + ')*';
    	      }

    	      if (token.optional) {
    	        if (prefix) {
    	          capture = '(?:' + prefix + '(' + capture + '))?';
    	        } else {
    	          capture = '(' + capture + ')?';
    	        }
    	      } else {
    	        capture = prefix + '(' + capture + ')';
    	      }

    	      route += capture;
    	    }
    	  }

    	  // In non-strict mode we allow a slash at the end of match. If the path to
    	  // match already ends with a slash, we remove it for consistency. The slash
    	  // is valid at the end of a path match, not in the middle. This is important
    	  // in non-ending mode, where "/test/" shouldn't match "/test//route".
    	  if (!strict) {
    	    route = (endsWithSlash ? route.slice(0, -2) : route) + '(?:\\/(?=$))?';
    	  }

    	  if (end) {
    	    route += '$';
    	  } else {
    	    // In non-ending mode, we need the capturing groups to match as much as
    	    // possible by using a positive lookahead to the end or next path segment.
    	    route += strict && endsWithSlash ? '' : '(?=\\/|$)';
    	  }

    	  return new RegExp('^' + route, flags(options))
    	}

    	/**
    	 * Normalize the given path string, returning a regular expression.
    	 *
    	 * An empty array can be passed in for the keys, which will hold the
    	 * placeholder key descriptions. For example, using `/user/:id`, `keys` will
    	 * contain `[{ name: 'id', delimiter: '/', optional: false, repeat: false }]`.
    	 *
    	 * @param  {(String|RegExp|Array)} path
    	 * @param  {Array}                 [keys]
    	 * @param  {Object}                [options]
    	 * @return {RegExp}
    	 */
    	function pathToRegexp (path, keys, options) {
    	  keys = keys || [];

    	  if (!isarray(keys)) {
    	    options = keys;
    	    keys = [];
    	  } else if (!options) {
    	    options = {};
    	  }

    	  if (path instanceof RegExp) {
    	    return regexpToRegexp(path, keys)
    	  }

    	  if (isarray(path)) {
    	    return arrayToRegexp(path, keys, options)
    	  }

    	  return stringToRegexp(path, keys, options)
    	}

    	pathToRegexp_1.parse = parse_1;
    	pathToRegexp_1.compile = compile_1;
    	pathToRegexp_1.tokensToFunction = tokensToFunction_1;
    	pathToRegexp_1.tokensToRegExp = tokensToRegExp_1;

    	/**
    	   * Module dependencies.
    	   */

    	  

    	  /**
    	   * Short-cuts for global-object checks
    	   */

    	  var hasDocument = ('undefined' !== typeof document);
    	  var hasWindow = ('undefined' !== typeof window);
    	  var hasHistory = ('undefined' !== typeof history);
    	  var hasProcess = typeof process !== 'undefined';

    	  /**
    	   * Detect click event
    	   */
    	  var clickEvent = hasDocument && document.ontouchstart ? 'touchstart' : 'click';

    	  /**
    	   * To work properly with the URL
    	   * history.location generated polyfill in https://github.com/devote/HTML5-History-API
    	   */

    	  var isLocation = hasWindow && !!(window.history.location || window.location);

    	  /**
    	   * The page instance
    	   * @api private
    	   */
    	  function Page() {
    	    // public things
    	    this.callbacks = [];
    	    this.exits = [];
    	    this.current = '';
    	    this.len = 0;

    	    // private things
    	    this._decodeURLComponents = true;
    	    this._base = '';
    	    this._strict = false;
    	    this._running = false;
    	    this._hashbang = false;

    	    // bound functions
    	    this.clickHandler = this.clickHandler.bind(this);
    	    this._onpopstate = this._onpopstate.bind(this);
    	  }

    	  /**
    	   * Configure the instance of page. This can be called multiple times.
    	   *
    	   * @param {Object} options
    	   * @api public
    	   */

    	  Page.prototype.configure = function(options) {
    	    var opts = options || {};

    	    this._window = opts.window || (hasWindow && window);
    	    this._decodeURLComponents = opts.decodeURLComponents !== false;
    	    this._popstate = opts.popstate !== false && hasWindow;
    	    this._click = opts.click !== false && hasDocument;
    	    this._hashbang = !!opts.hashbang;

    	    var _window = this._window;
    	    if(this._popstate) {
    	      _window.addEventListener('popstate', this._onpopstate, false);
    	    } else if(hasWindow) {
    	      _window.removeEventListener('popstate', this._onpopstate, false);
    	    }

    	    if (this._click) {
    	      _window.document.addEventListener(clickEvent, this.clickHandler, false);
    	    } else if(hasDocument) {
    	      _window.document.removeEventListener(clickEvent, this.clickHandler, false);
    	    }

    	    if(this._hashbang && hasWindow && !hasHistory) {
    	      _window.addEventListener('hashchange', this._onpopstate, false);
    	    } else if(hasWindow) {
    	      _window.removeEventListener('hashchange', this._onpopstate, false);
    	    }
    	  };

    	  /**
    	   * Get or set basepath to `path`.
    	   *
    	   * @param {string} path
    	   * @api public
    	   */

    	  Page.prototype.base = function(path) {
    	    if (0 === arguments.length) return this._base;
    	    this._base = path;
    	  };

    	  /**
    	   * Gets the `base`, which depends on whether we are using History or
    	   * hashbang routing.

    	   * @api private
    	   */
    	  Page.prototype._getBase = function() {
    	    var base = this._base;
    	    if(!!base) return base;
    	    var loc = hasWindow && this._window && this._window.location;

    	    if(hasWindow && this._hashbang && loc && loc.protocol === 'file:') {
    	      base = loc.pathname;
    	    }

    	    return base;
    	  };

    	  /**
    	   * Get or set strict path matching to `enable`
    	   *
    	   * @param {boolean} enable
    	   * @api public
    	   */

    	  Page.prototype.strict = function(enable) {
    	    if (0 === arguments.length) return this._strict;
    	    this._strict = enable;
    	  };


    	  /**
    	   * Bind with the given `options`.
    	   *
    	   * Options:
    	   *
    	   *    - `click` bind to click events [true]
    	   *    - `popstate` bind to popstate [true]
    	   *    - `dispatch` perform initial dispatch [true]
    	   *
    	   * @param {Object} options
    	   * @api public
    	   */

    	  Page.prototype.start = function(options) {
    	    var opts = options || {};
    	    this.configure(opts);

    	    if (false === opts.dispatch) return;
    	    this._running = true;

    	    var url;
    	    if(isLocation) {
    	      var window = this._window;
    	      var loc = window.location;

    	      if(this._hashbang && ~loc.hash.indexOf('#!')) {
    	        url = loc.hash.substr(2) + loc.search;
    	      } else if (this._hashbang) {
    	        url = loc.search + loc.hash;
    	      } else {
    	        url = loc.pathname + loc.search + loc.hash;
    	      }
    	    }

    	    this.replace(url, null, true, opts.dispatch);
    	  };

    	  /**
    	   * Unbind click and popstate event handlers.
    	   *
    	   * @api public
    	   */

    	  Page.prototype.stop = function() {
    	    if (!this._running) return;
    	    this.current = '';
    	    this.len = 0;
    	    this._running = false;

    	    var window = this._window;
    	    this._click && window.document.removeEventListener(clickEvent, this.clickHandler, false);
    	    hasWindow && window.removeEventListener('popstate', this._onpopstate, false);
    	    hasWindow && window.removeEventListener('hashchange', this._onpopstate, false);
    	  };

    	  /**
    	   * Show `path` with optional `state` object.
    	   *
    	   * @param {string} path
    	   * @param {Object=} state
    	   * @param {boolean=} dispatch
    	   * @param {boolean=} push
    	   * @return {!Context}
    	   * @api public
    	   */

    	  Page.prototype.show = function(path, state, dispatch, push) {
    	    var ctx = new Context(path, state, this),
    	      prev = this.prevContext;
    	    this.prevContext = ctx;
    	    this.current = ctx.path;
    	    if (false !== dispatch) this.dispatch(ctx, prev);
    	    if (false !== ctx.handled && false !== push) ctx.pushState();
    	    return ctx;
    	  };

    	  /**
    	   * Goes back in the history
    	   * Back should always let the current route push state and then go back.
    	   *
    	   * @param {string} path - fallback path to go back if no more history exists, if undefined defaults to page.base
    	   * @param {Object=} state
    	   * @api public
    	   */

    	  Page.prototype.back = function(path, state) {
    	    var page = this;
    	    if (this.len > 0) {
    	      var window = this._window;
    	      // this may need more testing to see if all browsers
    	      // wait for the next tick to go back in history
    	      hasHistory && window.history.back();
    	      this.len--;
    	    } else if (path) {
    	      setTimeout(function() {
    	        page.show(path, state);
    	      });
    	    } else {
    	      setTimeout(function() {
    	        page.show(page._getBase(), state);
    	      });
    	    }
    	  };

    	  /**
    	   * Register route to redirect from one path to other
    	   * or just redirect to another route
    	   *
    	   * @param {string} from - if param 'to' is undefined redirects to 'from'
    	   * @param {string=} to
    	   * @api public
    	   */
    	  Page.prototype.redirect = function(from, to) {
    	    var inst = this;

    	    // Define route from a path to another
    	    if ('string' === typeof from && 'string' === typeof to) {
    	      page.call(this, from, function(e) {
    	        setTimeout(function() {
    	          inst.replace(/** @type {!string} */ (to));
    	        }, 0);
    	      });
    	    }

    	    // Wait for the push state and replace it with another
    	    if ('string' === typeof from && 'undefined' === typeof to) {
    	      setTimeout(function() {
    	        inst.replace(from);
    	      }, 0);
    	    }
    	  };

    	  /**
    	   * Replace `path` with optional `state` object.
    	   *
    	   * @param {string} path
    	   * @param {Object=} state
    	   * @param {boolean=} init
    	   * @param {boolean=} dispatch
    	   * @return {!Context}
    	   * @api public
    	   */


    	  Page.prototype.replace = function(path, state, init, dispatch) {
    	    var ctx = new Context(path, state, this),
    	      prev = this.prevContext;
    	    this.prevContext = ctx;
    	    this.current = ctx.path;
    	    ctx.init = init;
    	    ctx.save(); // save before dispatching, which may redirect
    	    if (false !== dispatch) this.dispatch(ctx, prev);
    	    return ctx;
    	  };

    	  /**
    	   * Dispatch the given `ctx`.
    	   *
    	   * @param {Context} ctx
    	   * @api private
    	   */

    	  Page.prototype.dispatch = function(ctx, prev) {
    	    var i = 0, j = 0, page = this;

    	    function nextExit() {
    	      var fn = page.exits[j++];
    	      if (!fn) return nextEnter();
    	      fn(prev, nextExit);
    	    }

    	    function nextEnter() {
    	      var fn = page.callbacks[i++];

    	      if (ctx.path !== page.current) {
    	        ctx.handled = false;
    	        return;
    	      }
    	      if (!fn) return unhandled.call(page, ctx);
    	      fn(ctx, nextEnter);
    	    }

    	    if (prev) {
    	      nextExit();
    	    } else {
    	      nextEnter();
    	    }
    	  };

    	  /**
    	   * Register an exit route on `path` with
    	   * callback `fn()`, which will be called
    	   * on the previous context when a new
    	   * page is visited.
    	   */
    	  Page.prototype.exit = function(path, fn) {
    	    if (typeof path === 'function') {
    	      return this.exit('*', path);
    	    }

    	    var route = new Route(path, null, this);
    	    for (var i = 1; i < arguments.length; ++i) {
    	      this.exits.push(route.middleware(arguments[i]));
    	    }
    	  };

    	  /**
    	   * Handle "click" events.
    	   */

    	  /* jshint +W054 */
    	  Page.prototype.clickHandler = function(e) {
    	    if (1 !== this._which(e)) return;

    	    if (e.metaKey || e.ctrlKey || e.shiftKey) return;
    	    if (e.defaultPrevented) return;

    	    // ensure link
    	    // use shadow dom when available if not, fall back to composedPath()
    	    // for browsers that only have shady
    	    var el = e.target;
    	    var eventPath = e.path || (e.composedPath ? e.composedPath() : null);

    	    if(eventPath) {
    	      for (var i = 0; i < eventPath.length; i++) {
    	        if (!eventPath[i].nodeName) continue;
    	        if (eventPath[i].nodeName.toUpperCase() !== 'A') continue;
    	        if (!eventPath[i].href) continue;

    	        el = eventPath[i];
    	        break;
    	      }
    	    }

    	    // continue ensure link
    	    // el.nodeName for svg links are 'a' instead of 'A'
    	    while (el && 'A' !== el.nodeName.toUpperCase()) el = el.parentNode;
    	    if (!el || 'A' !== el.nodeName.toUpperCase()) return;

    	    // check if link is inside an svg
    	    // in this case, both href and target are always inside an object
    	    var svg = (typeof el.href === 'object') && el.href.constructor.name === 'SVGAnimatedString';

    	    // Ignore if tag has
    	    // 1. "download" attribute
    	    // 2. rel="external" attribute
    	    if (el.hasAttribute('download') || el.getAttribute('rel') === 'external') return;

    	    // ensure non-hash for the same path
    	    var link = el.getAttribute('href');
    	    if(!this._hashbang && this._samePath(el) && (el.hash || '#' === link)) return;

    	    // Check for mailto: in the href
    	    if (link && link.indexOf('mailto:') > -1) return;

    	    // check target
    	    // svg target is an object and its desired value is in .baseVal property
    	    if (svg ? el.target.baseVal : el.target) return;

    	    // x-origin
    	    // note: svg links that are not relative don't call click events (and skip page.js)
    	    // consequently, all svg links tested inside page.js are relative and in the same origin
    	    if (!svg && !this.sameOrigin(el.href)) return;

    	    // rebuild path
    	    // There aren't .pathname and .search properties in svg links, so we use href
    	    // Also, svg href is an object and its desired value is in .baseVal property
    	    var path = svg ? el.href.baseVal : (el.pathname + el.search + (el.hash || ''));

    	    path = path[0] !== '/' ? '/' + path : path;

    	    // strip leading "/[drive letter]:" on NW.js on Windows
    	    if (hasProcess && path.match(/^\/[a-zA-Z]:\//)) {
    	      path = path.replace(/^\/[a-zA-Z]:\//, '/');
    	    }

    	    // same page
    	    var orig = path;
    	    var pageBase = this._getBase();

    	    if (path.indexOf(pageBase) === 0) {
    	      path = path.substr(pageBase.length);
    	    }

    	    if (this._hashbang) path = path.replace('#!', '');

    	    if (pageBase && orig === path && (!isLocation || this._window.location.protocol !== 'file:')) {
    	      return;
    	    }

    	    e.preventDefault();
    	    this.show(orig);
    	  };

    	  /**
    	   * Handle "populate" events.
    	   * @api private
    	   */

    	  Page.prototype._onpopstate = (function () {
    	    var loaded = false;
    	    if ( ! hasWindow ) {
    	      return function () {};
    	    }
    	    if (hasDocument && document.readyState === 'complete') {
    	      loaded = true;
    	    } else {
    	      window.addEventListener('load', function() {
    	        setTimeout(function() {
    	          loaded = true;
    	        }, 0);
    	      });
    	    }
    	    return function onpopstate(e) {
    	      if (!loaded) return;
    	      var page = this;
    	      if (e.state) {
    	        var path = e.state.path;
    	        page.replace(path, e.state);
    	      } else if (isLocation) {
    	        var loc = page._window.location;
    	        page.show(loc.pathname + loc.search + loc.hash, undefined, undefined, false);
    	      }
    	    };
    	  })();

    	  /**
    	   * Event button.
    	   */
    	  Page.prototype._which = function(e) {
    	    e = e || (hasWindow && this._window.event);
    	    return null == e.which ? e.button : e.which;
    	  };

    	  /**
    	   * Convert to a URL object
    	   * @api private
    	   */
    	  Page.prototype._toURL = function(href) {
    	    var window = this._window;
    	    if(typeof URL === 'function' && isLocation) {
    	      return new URL(href, window.location.toString());
    	    } else if (hasDocument) {
    	      var anc = window.document.createElement('a');
    	      anc.href = href;
    	      return anc;
    	    }
    	  };

    	  /**
    	   * Check if `href` is the same origin.
    	   * @param {string} href
    	   * @api public
    	   */
    	  Page.prototype.sameOrigin = function(href) {
    	    if(!href || !isLocation) return false;

    	    var url = this._toURL(href);
    	    var window = this._window;

    	    var loc = window.location;

    	    /*
    	       When the port is the default http port 80 for http, or 443 for
    	       https, internet explorer 11 returns an empty string for loc.port,
    	       so we need to compare loc.port with an empty string if url.port
    	       is the default port 80 or 443.
    	       Also the comparition with `port` is changed from `===` to `==` because
    	       `port` can be a string sometimes. This only applies to ie11.
    	    */
    	    return loc.protocol === url.protocol &&
    	      loc.hostname === url.hostname &&
    	      (loc.port === url.port || loc.port === '' && (url.port == 80 || url.port == 443)); // jshint ignore:line
    	  };

    	  /**
    	   * @api private
    	   */
    	  Page.prototype._samePath = function(url) {
    	    if(!isLocation) return false;
    	    var window = this._window;
    	    var loc = window.location;
    	    return url.pathname === loc.pathname &&
    	      url.search === loc.search;
    	  };

    	  /**
    	   * Remove URL encoding from the given `str`.
    	   * Accommodates whitespace in both x-www-form-urlencoded
    	   * and regular percent-encoded form.
    	   *
    	   * @param {string} val - URL component to decode
    	   * @api private
    	   */
    	  Page.prototype._decodeURLEncodedURIComponent = function(val) {
    	    if (typeof val !== 'string') { return val; }
    	    return this._decodeURLComponents ? decodeURIComponent(val.replace(/\+/g, ' ')) : val;
    	  };

    	  /**
    	   * Create a new `page` instance and function
    	   */
    	  function createPage() {
    	    var pageInstance = new Page();

    	    function pageFn(/* args */) {
    	      return page.apply(pageInstance, arguments);
    	    }

    	    // Copy all of the things over. In 2.0 maybe we use setPrototypeOf
    	    pageFn.callbacks = pageInstance.callbacks;
    	    pageFn.exits = pageInstance.exits;
    	    pageFn.base = pageInstance.base.bind(pageInstance);
    	    pageFn.strict = pageInstance.strict.bind(pageInstance);
    	    pageFn.start = pageInstance.start.bind(pageInstance);
    	    pageFn.stop = pageInstance.stop.bind(pageInstance);
    	    pageFn.show = pageInstance.show.bind(pageInstance);
    	    pageFn.back = pageInstance.back.bind(pageInstance);
    	    pageFn.redirect = pageInstance.redirect.bind(pageInstance);
    	    pageFn.replace = pageInstance.replace.bind(pageInstance);
    	    pageFn.dispatch = pageInstance.dispatch.bind(pageInstance);
    	    pageFn.exit = pageInstance.exit.bind(pageInstance);
    	    pageFn.configure = pageInstance.configure.bind(pageInstance);
    	    pageFn.sameOrigin = pageInstance.sameOrigin.bind(pageInstance);
    	    pageFn.clickHandler = pageInstance.clickHandler.bind(pageInstance);

    	    pageFn.create = createPage;

    	    Object.defineProperty(pageFn, 'len', {
    	      get: function(){
    	        return pageInstance.len;
    	      },
    	      set: function(val) {
    	        pageInstance.len = val;
    	      }
    	    });

    	    Object.defineProperty(pageFn, 'current', {
    	      get: function(){
    	        return pageInstance.current;
    	      },
    	      set: function(val) {
    	        pageInstance.current = val;
    	      }
    	    });

    	    // In 2.0 these can be named exports
    	    pageFn.Context = Context;
    	    pageFn.Route = Route;

    	    return pageFn;
    	  }

    	  /**
    	   * Register `path` with callback `fn()`,
    	   * or route `path`, or redirection,
    	   * or `page.start()`.
    	   *
    	   *   page(fn);
    	   *   page('*', fn);
    	   *   page('/user/:id', load, user);
    	   *   page('/user/' + user.id, { some: 'thing' });
    	   *   page('/user/' + user.id);
    	   *   page('/from', '/to')
    	   *   page();
    	   *
    	   * @param {string|!Function|!Object} path
    	   * @param {Function=} fn
    	   * @api public
    	   */

    	  function page(path, fn) {
    	    // <callback>
    	    if ('function' === typeof path) {
    	      return page.call(this, '*', path);
    	    }

    	    // route <path> to <callback ...>
    	    if ('function' === typeof fn) {
    	      var route = new Route(/** @type {string} */ (path), null, this);
    	      for (var i = 1; i < arguments.length; ++i) {
    	        this.callbacks.push(route.middleware(arguments[i]));
    	      }
    	      // show <path> with [state]
    	    } else if ('string' === typeof path) {
    	      this['string' === typeof fn ? 'redirect' : 'show'](path, fn);
    	      // start [options]
    	    } else {
    	      this.start(path);
    	    }
    	  }

    	  /**
    	   * Unhandled `ctx`. When it's not the initial
    	   * popstate then redirect. If you wish to handle
    	   * 404s on your own use `page('*', callback)`.
    	   *
    	   * @param {Context} ctx
    	   * @api private
    	   */
    	  function unhandled(ctx) {
    	    if (ctx.handled) return;
    	    var current;
    	    var page = this;
    	    var window = page._window;

    	    if (page._hashbang) {
    	      current = isLocation && this._getBase() + window.location.hash.replace('#!', '');
    	    } else {
    	      current = isLocation && window.location.pathname + window.location.search;
    	    }

    	    if (current === ctx.canonicalPath) return;
    	    page.stop();
    	    ctx.handled = false;
    	    isLocation && (window.location.href = ctx.canonicalPath);
    	  }

    	  /**
    	   * Escapes RegExp characters in the given string.
    	   *
    	   * @param {string} s
    	   * @api private
    	   */
    	  function escapeRegExp(s) {
    	    return s.replace(/([.+*?=^!:${}()[\]|/\\])/g, '\\$1');
    	  }

    	  /**
    	   * Initialize a new "request" `Context`
    	   * with the given `path` and optional initial `state`.
    	   *
    	   * @constructor
    	   * @param {string} path
    	   * @param {Object=} state
    	   * @api public
    	   */

    	  function Context(path, state, pageInstance) {
    	    var _page = this.page = pageInstance || page;
    	    var window = _page._window;
    	    var hashbang = _page._hashbang;

    	    var pageBase = _page._getBase();
    	    if ('/' === path[0] && 0 !== path.indexOf(pageBase)) path = pageBase + (hashbang ? '#!' : '') + path;
    	    var i = path.indexOf('?');

    	    this.canonicalPath = path;
    	    var re = new RegExp('^' + escapeRegExp(pageBase));
    	    this.path = path.replace(re, '') || '/';
    	    if (hashbang) this.path = this.path.replace('#!', '') || '/';

    	    this.title = (hasDocument && window.document.title);
    	    this.state = state || {};
    	    this.state.path = path;
    	    this.querystring = ~i ? _page._decodeURLEncodedURIComponent(path.slice(i + 1)) : '';
    	    this.pathname = _page._decodeURLEncodedURIComponent(~i ? path.slice(0, i) : path);
    	    this.params = {};

    	    // fragment
    	    this.hash = '';
    	    if (!hashbang) {
    	      if (!~this.path.indexOf('#')) return;
    	      var parts = this.path.split('#');
    	      this.path = this.pathname = parts[0];
    	      this.hash = _page._decodeURLEncodedURIComponent(parts[1]) || '';
    	      this.querystring = this.querystring.split('#')[0];
    	    }
    	  }

    	  /**
    	   * Push state.
    	   *
    	   * @api private
    	   */

    	  Context.prototype.pushState = function() {
    	    var page = this.page;
    	    var window = page._window;
    	    var hashbang = page._hashbang;

    	    page.len++;
    	    if (hasHistory) {
    	        window.history.pushState(this.state, this.title,
    	          hashbang && this.path !== '/' ? '#!' + this.path : this.canonicalPath);
    	    }
    	  };

    	  /**
    	   * Save the context state.
    	   *
    	   * @api public
    	   */

    	  Context.prototype.save = function() {
    	    var page = this.page;
    	    if (hasHistory) {
    	        page._window.history.replaceState(this.state, this.title,
    	          page._hashbang && this.path !== '/' ? '#!' + this.path : this.canonicalPath);
    	    }
    	  };

    	  /**
    	   * Initialize `Route` with the given HTTP `path`,
    	   * and an array of `callbacks` and `options`.
    	   *
    	   * Options:
    	   *
    	   *   - `sensitive`    enable case-sensitive routes
    	   *   - `strict`       enable strict matching for trailing slashes
    	   *
    	   * @constructor
    	   * @param {string} path
    	   * @param {Object=} options
    	   * @api private
    	   */

    	  function Route(path, options, page) {
    	    var _page = this.page = page || globalPage;
    	    var opts = options || {};
    	    opts.strict = opts.strict || _page._strict;
    	    this.path = (path === '*') ? '(.*)' : path;
    	    this.method = 'GET';
    	    this.regexp = pathToRegexp_1(this.path, this.keys = [], opts);
    	  }

    	  /**
    	   * Return route middleware with
    	   * the given callback `fn()`.
    	   *
    	   * @param {Function} fn
    	   * @return {Function}
    	   * @api public
    	   */

    	  Route.prototype.middleware = function(fn) {
    	    var self = this;
    	    return function(ctx, next) {
    	      if (self.match(ctx.path, ctx.params)) {
    	        ctx.routePath = self.path;
    	        return fn(ctx, next);
    	      }
    	      next();
    	    };
    	  };

    	  /**
    	   * Check if this route matches `path`, if so
    	   * populate `params`.
    	   *
    	   * @param {string} path
    	   * @param {Object} params
    	   * @return {boolean}
    	   * @api private
    	   */

    	  Route.prototype.match = function(path, params) {
    	    var keys = this.keys,
    	      qsIndex = path.indexOf('?'),
    	      pathname = ~qsIndex ? path.slice(0, qsIndex) : path,
    	      m = this.regexp.exec(decodeURIComponent(pathname));

    	    if (!m) return false;

    	    delete params[0];

    	    for (var i = 1, len = m.length; i < len; ++i) {
    	      var key = keys[i - 1];
    	      var val = this.page._decodeURLEncodedURIComponent(m[i]);
    	      if (val !== undefined || !(hasOwnProperty.call(params, key.name))) {
    	        params[key.name] = val;
    	      }
    	    }

    	    return true;
    	  };


    	  /**
    	   * Module exports.
    	   */

    	  var globalPage = createPage();
    	  var page_js = globalPage;
    	  var default_1 = globalPage;

    	page_js.default = default_1;

    	return page_js;

    	}))); 
    } (page));

    var pageExports = page.exports;
    var router = /*@__PURE__*/getDefaultExportFromCjs(pageExports);

    /* src\App.svelte generated by Svelte v3.59.2 */
    const file = "src\\App.svelte";

    // (117:0) {:else}
    function create_else_block(ctx) {
    	let div;
    	let loadingerror;
    	let current;

    	loadingerror = new LoadingError({
    			props: { message: /*errorMessage*/ ctx[4] },
    			$$inline: true
    		});

    	loadingerror.$on("click", /*loadItems*/ ctx[5]);

    	const block = {
    		c: function create() {
    			div = element("div");
    			create_component(loadingerror.$$.fragment);
    			attr_dev(div, "class", "w-100 h-100 background-color d-flex justify-content-center align-items-center");
    			add_location(div, file, 117, 1, 3281);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			mount_component(loadingerror, div, null);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const loadingerror_changes = {};
    			if (dirty & /*errorMessage*/ 16) loadingerror_changes.message = /*errorMessage*/ ctx[4];
    			loadingerror.$set(loadingerror_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(loadingerror.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(loadingerror.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_component(loadingerror);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block.name,
    		type: "else",
    		source: "(117:0) {:else}",
    		ctx
    	});

    	return block;
    }

    // (113:41) 
    function create_if_block_1(ctx) {
    	let div;
    	let spinkit;
    	let current;
    	spinkit = new Spinkit({ $$inline: true });

    	const block = {
    		c: function create() {
    			div = element("div");
    			create_component(spinkit.$$.fragment);
    			attr_dev(div, "class", "w-100 h-100 background-color d-flex justify-content-center align-items-center");
    			add_location(div, file, 113, 1, 3154);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			mount_component(spinkit, div, null);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(spinkit.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(spinkit.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_component(spinkit);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1.name,
    		type: "if",
    		source: "(113:41) ",
    		ctx
    	});

    	return block;
    }

    // (111:0) {#if state == NetworkStates.loaded}
    function create_if_block(ctx) {
    	let switch_instance;
    	let switch_instance_anchor;
    	let current;
    	var switch_value = /*page*/ ctx[0];

    	function switch_props(ctx) {
    		return {
    			props: {
    				params: /*params*/ ctx[1],
    				status: /*userData*/ ctx[3].status
    			},
    			$$inline: true
    		};
    	}

    	if (switch_value) {
    		switch_instance = construct_svelte_component_dev(switch_value, switch_props(ctx));
    	}

    	const block = {
    		c: function create() {
    			if (switch_instance) create_component(switch_instance.$$.fragment);
    			switch_instance_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if (switch_instance) mount_component(switch_instance, target, anchor);
    			insert_dev(target, switch_instance_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const switch_instance_changes = {};
    			if (dirty & /*params*/ 2) switch_instance_changes.params = /*params*/ ctx[1];
    			if (dirty & /*userData*/ 8) switch_instance_changes.status = /*userData*/ ctx[3].status;

    			if (dirty & /*page*/ 1 && switch_value !== (switch_value = /*page*/ ctx[0])) {
    				if (switch_instance) {
    					group_outros();
    					const old_component = switch_instance;

    					transition_out(old_component.$$.fragment, 1, 0, () => {
    						destroy_component(old_component, 1);
    					});

    					check_outros();
    				}

    				if (switch_value) {
    					switch_instance = construct_svelte_component_dev(switch_value, switch_props(ctx));
    					create_component(switch_instance.$$.fragment);
    					transition_in(switch_instance.$$.fragment, 1);
    					mount_component(switch_instance, switch_instance_anchor.parentNode, switch_instance_anchor);
    				} else {
    					switch_instance = null;
    				}
    			} else if (switch_value) {
    				switch_instance.$set(switch_instance_changes);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			if (switch_instance) transition_in(switch_instance.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			if (switch_instance) transition_out(switch_instance.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(switch_instance_anchor);
    			if (switch_instance) destroy_component(switch_instance, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block.name,
    		type: "if",
    		source: "(111:0) {#if state == NetworkStates.loaded}",
    		ctx
    	});

    	return block;
    }

    function create_fragment(ctx) {
    	let t;
    	let current_block_type_index;
    	let if_block;
    	let if_block_anchor;
    	let current;
    	const if_block_creators = [create_if_block, create_if_block_1, create_else_block];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*state*/ ctx[2] == NetworkStates.loaded) return 0;
    		if (/*state*/ ctx[2] == NetworkStates.loading) return 1;
    		return 2;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block = {
    		c: function create() {
    			t = space();
    			if_block.c();
    			if_block_anchor = empty();
    			document.title = "Dashboard";
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    			if_blocks[current_block_type_index].m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				} else {
    					if_block.p(ctx, dirty);
    				}

    				transition_in(if_block, 1);
    				if_block.m(if_block_anchor.parentNode, if_block_anchor);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    			if_blocks[current_block_type_index].d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance($$self, $$props, $$invalidate) {
    	let $basicDetails;
    	validate_store(basicDetails, 'basicDetails');
    	component_subscribe($$self, basicDetails, $$value => $$invalidate(6, $basicDetails = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('App', slots, []);
    	let page;
    	let params;
    	let state;
    	let userData;
    	let errorMessage;

    	router('/verification', () => {
    		$$invalidate(1, params = undefined);
    		$$invalidate(0, page = IDVerification);
    	});

    	router('/purchase-plan', () => {
    		$$invalidate(1, params = undefined);
    		$$invalidate(0, page = Purchase);
    	});

    	router('/dashboard', () => {
    		$$invalidate(1, params = undefined);
    		$$invalidate(0, page = Overview);
    	});

    	router('/deposit', () => {
    		$$invalidate(1, params = undefined);
    		$$invalidate(0, page = Deposit);
    	});

    	router(
    		'/deposit/:method/:amount',
    		(ctx, next) => {
    			$$invalidate(1, params = ctx.params);
    			next();
    		},
    		() => $$invalidate(0, page = Deposit)
    	);

    	router('/profile', () => {
    		$$invalidate(1, params = undefined);
    		$$invalidate(0, page = Profile);
    	});

    	router("/transactions", () => {
    		$$invalidate(1, params = undefined);
    		$$invalidate(0, page = Transactions);
    	});

    	router("/withdraw", () => {
    		$$invalidate(1, params = undefined);
    		$$invalidate(0, page = Withdraw);
    	});

    	router("/settings", () => {
    		$$invalidate(1, params = undefined);
    		$$invalidate(0, page = Settings);
    	});

    	router.start();

    	async function loadItems() {
    		$$invalidate(2, state = NetworkStates.loading);

    		if (isStringEmptyOrWhitespace($basicDetails.firstname)) {
    			let result = await fetchAndSendDataWithJson("/basic-details");

    			if (result.status) {
    				changeLanguage(result.data.language);
    				set_store_value(basicDetails, $basicDetails = result.data, $basicDetails);
    			}
    		}

    		let result = await fetchAndSendDataWithJson("/verification");

    		if (result.status) {
    			$$invalidate(3, userData = result.data);

    			if (userData.status != user_verification_status.verified && window.location.pathname != '/verification') {
    				$$invalidate(0, page = IDVerification);
    				location.assign('/verification');
    			} else if (userData.status == user_verification_status.verified && window.location.pathname == '/verification') {
    				$$invalidate(0, page = Overview);
    				location.assign('/dashboard');
    			}

    			$$invalidate(2, state = NetworkStates.loaded);
    		} else {
    			$$invalidate(4, errorMessage = result.message);
    			$$invalidate(2, state = NetworkStates.error);
    		}
    	}

    	onMount(async () => {
    		// fakeLogin();
    		loadItems();
    	});

    	onDestroy(() => {
    		set_store_value(
    			basicDetails,
    			$basicDetails = {
    				firstname: "",
    				lastname: "",
    				picture: "",
    				date: "",
    				paymentMethods: []
    			},
    			$basicDetails
    		);
    	});

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<App> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		Overview,
    		Deposit,
    		Profile,
    		Transactions,
    		Withdraw,
    		Settings,
    		IDVerification,
    		Purchase,
    		Spinkit,
    		LoadingError,
    		onDestroy,
    		onMount,
    		isStringEmptyOrWhitespace,
    		basicDetails,
    		fetchAndSendDataWithJson,
    		changeLanguage,
    		NetworkStates,
    		user_verification_status,
    		router,
    		page,
    		params,
    		state,
    		userData,
    		errorMessage,
    		loadItems,
    		$basicDetails
    	});

    	$$self.$inject_state = $$props => {
    		if ('page' in $$props) $$invalidate(0, page = $$props.page);
    		if ('params' in $$props) $$invalidate(1, params = $$props.params);
    		if ('state' in $$props) $$invalidate(2, state = $$props.state);
    		if ('userData' in $$props) $$invalidate(3, userData = $$props.userData);
    		if ('errorMessage' in $$props) $$invalidate(4, errorMessage = $$props.errorMessage);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [page, params, state, userData, errorMessage, loadItems];
    }

    class App extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance, create_fragment, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "App",
    			options,
    			id: create_fragment.name
    		});
    	}
    }

    const app = new App({
    	target: document.body,
    	// props: {
    	// 	name: 'world'
    	// }
    });

    return app;

})();
//# sourceMappingURL=bundle.js.map
