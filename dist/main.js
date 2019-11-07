
(function(l, r) { if (l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (window.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.head.appendChild(r) })(window.document);
(function () {
    'use strict';

    function noop() { }
    const identity = x => x;
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

    const is_client = typeof window !== 'undefined';
    let now = is_client
        ? () => window.performance.now()
        : () => Date.now();
    let raf = is_client ? cb => requestAnimationFrame(cb) : noop;

    const tasks = new Set();
    let running = false;
    function run_tasks() {
        tasks.forEach(task => {
            if (!task[0](now())) {
                tasks.delete(task);
                task[1]();
            }
        });
        running = tasks.size > 0;
        if (running)
            raf(run_tasks);
    }
    function loop(fn) {
        let task;
        if (!running) {
            running = true;
            raf(run_tasks);
        }
        return {
            promise: new Promise(fulfil => {
                tasks.add(task = [fn, fulfil]);
            }),
            abort() {
                tasks.delete(task);
            }
        };
    }

    function append(target, node) {
        target.appendChild(node);
    }
    function insert(target, node, anchor) {
        target.insertBefore(node, anchor || null);
    }
    function detach(node) {
        node.parentNode.removeChild(node);
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
    function listen(node, event, handler, options) {
        node.addEventListener(event, handler, options);
        return () => node.removeEventListener(event, handler, options);
    }
    function attr(node, attribute, value) {
        if (value == null)
            node.removeAttribute(attribute);
        else
            node.setAttribute(attribute, value);
    }
    function children(element) {
        return Array.from(element.childNodes);
    }
    function set_input_value(input, value) {
        if (value != null || input.value) {
            input.value = value;
        }
    }
    function set_style(node, key, value, important) {
        node.style.setProperty(key, value, important ? 'important' : '');
    }
    function custom_event(type, detail) {
        const e = document.createEvent('CustomEvent');
        e.initCustomEvent(type, false, false, detail);
        return e;
    }

    let stylesheet;
    let active = 0;
    let current_rules = {};
    // https://github.com/darkskyapp/string-hash/blob/master/index.js
    function hash(str) {
        let hash = 5381;
        let i = str.length;
        while (i--)
            hash = ((hash << 5) - hash) ^ str.charCodeAt(i);
        return hash >>> 0;
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
        if (!current_rules[name]) {
            if (!stylesheet) {
                const style = element('style');
                document.head.appendChild(style);
                stylesheet = style.sheet;
            }
            current_rules[name] = true;
            stylesheet.insertRule(`@keyframes ${name} ${rule}`, stylesheet.cssRules.length);
        }
        const animation = node.style.animation || '';
        node.style.animation = `${animation ? `${animation}, ` : ``}${name} ${duration}ms linear ${delay}ms 1 both`;
        active += 1;
        return name;
    }
    function delete_rule(node, name) {
        node.style.animation = (node.style.animation || '')
            .split(', ')
            .filter(name
            ? anim => anim.indexOf(name) < 0 // remove specific animation
            : anim => anim.indexOf('__svelte') === -1 // remove all Svelte animations
        )
            .join(', ');
        if (name && !--active)
            clear_rules();
    }
    function clear_rules() {
        raf(() => {
            if (active)
                return;
            let i = stylesheet.cssRules.length;
            while (i--)
                stylesheet.deleteRule(i);
            current_rules = {};
        });
    }

    let current_component;
    function set_current_component(component) {
        current_component = component;
    }

    const dirty_components = [];
    const binding_callbacks = [];
    const render_callbacks = [];
    const flush_callbacks = [];
    const resolved_promise = Promise.resolve();
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
    function flush() {
        const seen_callbacks = new Set();
        do {
            // first, call beforeUpdate functions
            // and update components
            while (dirty_components.length) {
                const component = dirty_components.shift();
                set_current_component(component);
                update(component.$$);
            }
            while (binding_callbacks.length)
                binding_callbacks.pop()();
            // then, once components are updated, call
            // afterUpdate functions. This may cause
            // subsequent updates...
            for (let i = 0; i < render_callbacks.length; i += 1) {
                const callback = render_callbacks[i];
                if (!seen_callbacks.has(callback)) {
                    callback();
                    // ...so guard against infinite loops
                    seen_callbacks.add(callback);
                }
            }
            render_callbacks.length = 0;
        } while (dirty_components.length);
        while (flush_callbacks.length) {
            flush_callbacks.pop()();
        }
        update_scheduled = false;
    }
    function update($$) {
        if ($$.fragment) {
            $$.update($$.dirty);
            run_all($$.before_update);
            $$.fragment.p($$.dirty, $$.ctx);
            $$.dirty = null;
            $$.after_update.forEach(add_render_callback);
        }
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
    }
    const null_transition = { duration: 0 };
    function create_in_transition(node, fn, params) {
        let config = fn(node, params);
        let running = false;
        let animation_name;
        let task;
        let uid = 0;
        function cleanup() {
            if (animation_name)
                delete_rule(node, animation_name);
        }
        function go() {
            const { delay = 0, duration = 300, easing = identity, tick = noop, css } = config || null_transition;
            if (css)
                animation_name = create_rule(node, 0, 1, duration, delay, easing, css, uid++);
            tick(0, 1);
            const start_time = now() + delay;
            const end_time = start_time + duration;
            if (task)
                task.abort();
            running = true;
            add_render_callback(() => dispatch(node, true, 'start'));
            task = loop(now => {
                if (running) {
                    if (now >= end_time) {
                        tick(1, 0);
                        dispatch(node, true, 'end');
                        cleanup();
                        return running = false;
                    }
                    if (now >= start_time) {
                        const t = easing((now - start_time) / duration);
                        tick(t, 1 - t);
                    }
                }
                return running;
            });
        }
        let started = false;
        return {
            start() {
                if (started)
                    return;
                delete_rule(node);
                if (is_function(config)) {
                    config = config();
                    wait().then(go);
                }
                else {
                    go();
                }
            },
            invalidate() {
                started = false;
            },
            end() {
                if (running) {
                    cleanup();
                    running = false;
                }
            }
        };
    }
    function create_out_transition(node, fn, params) {
        let config = fn(node, params);
        let running = true;
        let animation_name;
        const group = outros;
        group.r += 1;
        function go() {
            const { delay = 0, duration = 300, easing = identity, tick = noop, css } = config || null_transition;
            if (css)
                animation_name = create_rule(node, 1, 0, duration, delay, easing, css);
            const start_time = now() + delay;
            const end_time = start_time + duration;
            add_render_callback(() => dispatch(node, false, 'start'));
            loop(now => {
                if (running) {
                    if (now >= end_time) {
                        tick(0, 1);
                        dispatch(node, false, 'end');
                        if (!--group.r) {
                            // this will result in `end()` being called,
                            // so we don't need to clean up here
                            run_all(group.c);
                        }
                        return false;
                    }
                    if (now >= start_time) {
                        const t = easing((now - start_time) / duration);
                        tick(1 - t, t);
                    }
                }
                return running;
            });
        }
        if (is_function(config)) {
            wait().then(() => {
                // @ts-ignore
                config = config();
                go();
            });
        }
        else {
            go();
        }
        return {
            end(reset) {
                if (reset && config.tick) {
                    config.tick(1, 0);
                }
                if (running) {
                    if (animation_name)
                        delete_rule(node, animation_name);
                    running = false;
                }
            }
        };
    }

    function bind(component, name, callback) {
        if (component.$$.props.indexOf(name) === -1)
            return;
        component.$$.bound[name] = callback;
        callback(component.$$.ctx[name]);
    }
    function mount_component(component, target, anchor) {
        const { fragment, on_mount, on_destroy, after_update } = component.$$;
        fragment.m(target, anchor);
        // onMount happens before the initial afterUpdate
        add_render_callback(() => {
            const new_on_destroy = on_mount.map(run).filter(is_function);
            if (on_destroy) {
                on_destroy.push(...new_on_destroy);
            }
            else {
                // Edge case - component was destroyed immediately,
                // most likely as a result of a binding initialising
                run_all(new_on_destroy);
            }
            component.$$.on_mount = [];
        });
        after_update.forEach(add_render_callback);
    }
    function destroy_component(component, detaching) {
        if (component.$$.fragment) {
            run_all(component.$$.on_destroy);
            component.$$.fragment.d(detaching);
            // TODO null out other refs, including component.$$ (but need to
            // preserve final state?)
            component.$$.on_destroy = component.$$.fragment = null;
            component.$$.ctx = {};
        }
    }
    function make_dirty(component, key) {
        if (!component.$$.dirty) {
            dirty_components.push(component);
            schedule_update();
            component.$$.dirty = blank_object();
        }
        component.$$.dirty[key] = true;
    }
    function init(component, options, instance, create_fragment, not_equal, prop_names) {
        const parent_component = current_component;
        set_current_component(component);
        const props = options.props || {};
        const $$ = component.$$ = {
            fragment: null,
            ctx: null,
            // state
            props: prop_names,
            update: noop,
            not_equal,
            bound: blank_object(),
            // lifecycle
            on_mount: [],
            on_destroy: [],
            before_update: [],
            after_update: [],
            context: new Map(parent_component ? parent_component.$$.context : []),
            // everything else
            callbacks: blank_object(),
            dirty: null
        };
        let ready = false;
        $$.ctx = instance
            ? instance(component, props, (key, ret, value = ret) => {
                if ($$.ctx && not_equal($$.ctx[key], $$.ctx[key] = value)) {
                    if ($$.bound[key])
                        $$.bound[key](value);
                    if (ready)
                        make_dirty(component, key);
                }
                return ret;
            })
            : props;
        $$.update();
        ready = true;
        run_all($$.before_update);
        $$.fragment = create_fragment($$.ctx);
        if (options.target) {
            if (options.hydrate) {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment.l(children(options.target));
            }
            else {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment.c();
            }
            if (options.intro)
                transition_in(component.$$.fragment);
            mount_component(component, options.target, options.anchor);
            flush();
        }
        set_current_component(parent_component);
    }
    class SvelteComponent {
        $destroy() {
            destroy_component(this, 1);
            this.$destroy = noop;
        }
        $on(type, callback) {
            const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
            callbacks.push(callback);
            return () => {
                const index = callbacks.indexOf(callback);
                if (index !== -1)
                    callbacks.splice(index, 1);
            };
        }
        $set() {
            // overridden by instance, if it has props
        }
    }

    function dispatch_dev(type, detail) {
        document.dispatchEvent(custom_event(type, detail));
    }
    function append_dev(target, node) {
        dispatch_dev("SvelteDOMInsert", { target, node });
        append(target, node);
    }
    function insert_dev(target, node, anchor) {
        dispatch_dev("SvelteDOMInsert", { target, node, anchor });
        insert(target, node, anchor);
    }
    function detach_dev(node) {
        dispatch_dev("SvelteDOMRemove", { node });
        detach(node);
    }
    function listen_dev(node, event, handler, options, has_prevent_default, has_stop_propagation) {
        const modifiers = options === true ? ["capture"] : options ? Array.from(Object.keys(options)) : [];
        if (has_prevent_default)
            modifiers.push('preventDefault');
        if (has_stop_propagation)
            modifiers.push('stopPropagation');
        dispatch_dev("SvelteDOMAddEventListener", { node, event, handler, modifiers });
        const dispose = listen(node, event, handler, options);
        return () => {
            dispatch_dev("SvelteDOMRemoveEventListener", { node, event, handler, modifiers });
            dispose();
        };
    }
    function attr_dev(node, attribute, value) {
        attr(node, attribute, value);
        if (value == null)
            dispatch_dev("SvelteDOMRemoveAttribute", { node, attribute });
        else
            dispatch_dev("SvelteDOMSetAttribute", { node, attribute, value });
    }
    function prop_dev(node, property, value) {
        node[property] = value;
        dispatch_dev("SvelteDOMSetProperty", { node, property, value });
    }
    function set_data_dev(text, data) {
        data = '' + data;
        if (text.data === data)
            return;
        dispatch_dev("SvelteDOMSetData", { node: text, data });
        text.data = data;
    }
    class SvelteComponentDev extends SvelteComponent {
        constructor(options) {
            if (!options || (!options.target && !options.$$inline)) {
                throw new Error(`'target' is a required option`);
            }
            super();
        }
        $destroy() {
            super.$destroy();
            this.$destroy = () => {
                console.warn(`Component was already destroyed`); // eslint-disable-line no-console
            };
        }
    }

    /* src\Button.svelte generated by Svelte v3.12.1 */

    const file = "src\\Button.svelte";

    function create_fragment(ctx) {
    	var button, dispose;

    	const block = {
    		c: function create() {
    			button = element("button");
    			button.textContent = "Open";
    			attr_dev(button, "class", "color space border-none bg-teal-500 hover:bg-teal-400 rounded svelte-3gymvv");
    			add_location(button, file, 7, 0, 172);
    			dispose = listen_dev(button, "click", ctx.open);
    		},

    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},

    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);
    		},

    		p: noop,
    		i: noop,
    		o: noop,

    		d: function destroy(detaching) {
    			if (detaching) {
    				detach_dev(button);
    			}

    			dispose();
    		}
    	};
    	dispatch_dev("SvelteRegisterBlock", { block, id: create_fragment.name, type: "component", source: "", ctx });
    	return block;
    }

    function instance($$self, $$props, $$invalidate) {
    	let { open } = $$props;

    	const writable_props = ['open'];
    	Object.keys($$props).forEach(key => {
    		if (!writable_props.includes(key) && !key.startsWith('$$')) console.warn(`<Button> was created with unknown prop '${key}'`);
    	});

    	$$self.$set = $$props => {
    		if ('open' in $$props) $$invalidate('open', open = $$props.open);
    	};

    	$$self.$capture_state = () => {
    		return { open };
    	};

    	$$self.$inject_state = $$props => {
    		if ('open' in $$props) $$invalidate('open', open = $$props.open);
    	};

    	return { open };
    }

    class Button extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance, create_fragment, safe_not_equal, ["open"]);
    		dispatch_dev("SvelteRegisterComponent", { component: this, tagName: "Button", options, id: create_fragment.name });

    		const { ctx } = this.$$;
    		const props = options.props || {};
    		if (ctx.open === undefined && !('open' in props)) {
    			console.warn("<Button> was created without expected prop 'open'");
    		}
    	}

    	get open() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set open(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\GithubButton.svelte generated by Svelte v3.12.1 */

    const file$1 = "src\\GithubButton.svelte";

    function create_fragment$1(ctx) {
    	var a, svg, title, t0, path, t1, span, t2;

    	const block = {
    		c: function create() {
    			a = element("a");
    			svg = svg_element("svg");
    			title = svg_element("title");
    			t0 = text("GitHub icon");
    			path = svg_element("path");
    			t1 = space();
    			span = element("span");
    			t2 = text(ctx.caption);
    			add_location(title, file$1, 5, 109, 393);
    			attr_dev(path, "d", "M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12");
    			add_location(path, file$1, 5, 135, 419);
    			attr_dev(svg, "class", "fill-current w-4 h-4 mr-2");
    			attr_dev(svg, "role", "img");
    			attr_dev(svg, "viewBox", "0 0 24 24");
    			attr_dev(svg, "xmlns", "http://www.w3.org/2000/svg");
    			add_location(svg, file$1, 5, 4, 288);
    			add_location(span, file$1, 6, 4, 1155);
    			attr_dev(a, "class", "content-center bg-gray-400 hover:bg-teal-300 text-gray-100 rounded-full font-bold py-8 px-4 inline-flex items-center");
    			attr_dev(a, "href", ctx.url);
    			attr_dev(a, "target", "_blank");
    			set_style(a, "color", "black");
    			set_style(a, "text-decoration", "none");
    			set_style(a, "margin-left", "25vw");
    			add_location(a, file$1, 4, 0, 67);
    		},

    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},

    		m: function mount(target, anchor) {
    			insert_dev(target, a, anchor);
    			append_dev(a, svg);
    			append_dev(svg, title);
    			append_dev(title, t0);
    			append_dev(svg, path);
    			append_dev(a, t1);
    			append_dev(a, span);
    			append_dev(span, t2);
    		},

    		p: function update(changed, ctx) {
    			if (changed.caption) {
    				set_data_dev(t2, ctx.caption);
    			}

    			if (changed.url) {
    				attr_dev(a, "href", ctx.url);
    			}
    		},

    		i: noop,
    		o: noop,

    		d: function destroy(detaching) {
    			if (detaching) {
    				detach_dev(a);
    			}
    		}
    	};
    	dispatch_dev("SvelteRegisterBlock", { block, id: create_fragment$1.name, type: "component", source: "", ctx });
    	return block;
    }

    function instance$1($$self, $$props, $$invalidate) {
    	let { caption, url } = $$props;

    	const writable_props = ['caption', 'url'];
    	Object.keys($$props).forEach(key => {
    		if (!writable_props.includes(key) && !key.startsWith('$$')) console.warn(`<GithubButton> was created with unknown prop '${key}'`);
    	});

    	$$self.$set = $$props => {
    		if ('caption' in $$props) $$invalidate('caption', caption = $$props.caption);
    		if ('url' in $$props) $$invalidate('url', url = $$props.url);
    	};

    	$$self.$capture_state = () => {
    		return { caption, url };
    	};

    	$$self.$inject_state = $$props => {
    		if ('caption' in $$props) $$invalidate('caption', caption = $$props.caption);
    		if ('url' in $$props) $$invalidate('url', url = $$props.url);
    	};

    	return { caption, url };
    }

    class GithubButton extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$1, create_fragment$1, safe_not_equal, ["caption", "url"]);
    		dispatch_dev("SvelteRegisterComponent", { component: this, tagName: "GithubButton", options, id: create_fragment$1.name });

    		const { ctx } = this.$$;
    		const props = options.props || {};
    		if (ctx.caption === undefined && !('caption' in props)) {
    			console.warn("<GithubButton> was created without expected prop 'caption'");
    		}
    		if (ctx.url === undefined && !('url' in props)) {
    			console.warn("<GithubButton> was created without expected prop 'url'");
    		}
    	}

    	get caption() {
    		throw new Error("<GithubButton>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set caption(value) {
    		throw new Error("<GithubButton>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get url() {
    		throw new Error("<GithubButton>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set url(value) {
    		throw new Error("<GithubButton>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    function cubicOut(t) {
        const f = t - 1.0;
        return f * f * f + 1.0;
    }

    function fade(node, { delay = 0, duration = 400 }) {
        const o = +getComputedStyle(node).opacity;
        return {
            delay,
            duration,
            css: t => `opacity: ${t * o}`
        };
    }
    function fly(node, { delay = 0, duration = 400, easing = cubicOut, x = 0, y = 0, opacity = 0 }) {
        const style = getComputedStyle(node);
        const target_opacity = +style.opacity;
        const transform = style.transform === 'none' ? '' : style.transform;
        const od = target_opacity * (1 - opacity);
        return {
            delay,
            duration,
            easing,
            css: (t, u) => `
			transform: ${transform} translate(${(1 - t) * x}px, ${(1 - t) * y}px);
			opacity: ${target_opacity - (od * u)}`
        };
    }

    let Ddi = {};
        Ddi.ddiList = [
        {"cdCountry":"55","nmCountry":"Brazil (+55)","isoCountry":"br"}
        ,{"cdCountry":"64","nmCountry":"New Zealand (+64)","isoCountry":"nz"}
        ,{"cdCountry":"61","nmCountry":"Australia (+61)","isoCountry":"au"}
        ,{"cdCountry":"1","nmCountry":"USA (+1)","isoCountry":"us"}
        ,{"cdCountry":"44","nmCountry":"UK (+44)","isoCountry":"gb"}
        ,{"cdCountry":"213","nmCountry":"Algeria (+213)","isoCountry":"dz"}
        ,{"cdCountry":"376","nmCountry":"Andorra (+376)","isoCountry":"ad"}
        ,{"cdCountry":"244","nmCountry":"Angola (+244)","isoCountry":"ao"}
        ,{"cdCountry":"1264","nmCountry":"Anguilla (+1264)","isoCountry":"ai"}
        ,{"cdCountry":"1268","nmCountry":"Antigua &amp; Barbuda (+1268)","isoCountry":"ag"}
        ,{"cdCountry":"54","nmCountry":"Argentina (+54)","isoCountry":"ar"}
        ,{"cdCountry":"374","nmCountry":"Armenia (+374)","isoCountry":"am"}
        ,{"cdCountry":"297","nmCountry":"Aruba (+297)","isoCountry":"aw"}
        ,{"cdCountry":"43","nmCountry":"Austria (+43)","isoCountry":"at"}
        ,{"cdCountry":"994","nmCountry":"Azerbaijan (+994)","isoCountry":"az"}
        ,{"cdCountry":"1242","nmCountry":"Bahamas (+1242)","isoCountry":"bs"}
        ,{"cdCountry":"973","nmCountry":"Bahrain (+973)","isoCountry":"bh"}
        ,{"cdCountry":"880","nmCountry":"Bangladesh (+880)","isoCountry":"bd"}
        ,{"cdCountry":"1246","nmCountry":"Barbados (+1246)","isoCountry":"bb"}
        ,{"cdCountry":"375","nmCountry":"Belarus (+375)","isoCountry":"by"}
        ,{"cdCountry":"32","nmCountry":"Belgium (+32)","isoCountry":"be"}
        ,{"cdCountry":"501","nmCountry":"Belize (+501)","isoCountry":"bz"}
        ,{"cdCountry":"229","nmCountry":"Benin (+229)","isoCountry":"bj"}
        ,{"cdCountry":"1441","nmCountry":"Bermuda (+1441)","isoCountry":"bm"}
        ,{"cdCountry":"975","nmCountry":"Bhutan (+975)","isoCountry":"bt"}
        ,{"cdCountry":"591","nmCountry":"Bolivia (+591)","isoCountry":"bo"}
        ,{"cdCountry":"387","nmCountry":"Bosnia Herzegovina (+387)","isoCountry":"ba"}
        ,{"cdCountry":"267","nmCountry":"Botswana (+267)","isoCountry":"bw"}
        ,{"cdCountry":"673","nmCountry":"Brunei (+673)","isoCountry":"bn"}
        ,{"cdCountry":"359","nmCountry":"Bulgaria (+359)","isoCountry":"bg"}
        ,{"cdCountry":"226","nmCountry":"Burkina Faso (+226)","isoCountry":"bf"}
        ,{"cdCountry":"257","nmCountry":"Burundi (+257)","isoCountry":"bi"}
        ,{"cdCountry":"855","nmCountry":"Cambodia (+855)","isoCountry":"kh"}
        ,{"cdCountry":"237","nmCountry":"Cameroon (+237)","isoCountry":"cm"}
        ,{"cdCountry":"1","nmCountry":"Canada (+1)","isoCountry":"ca"}
        ,{"cdCountry":"238","nmCountry":"Cape Verde Islands (+238)","isoCountry":"cv"}
        ,{"cdCountry":"1345","nmCountry":"Cayman Islands (+1345)","isoCountry":"ky"}
        ,{"cdCountry":"236","nmCountry":"Central African Republic (+236)","isoCountry":"cf"}
        ,{"cdCountry":"235","nmCountry":"Chade (+235)","isoCountry":"td"}
        ,{"cdCountry":"56","nmCountry":"Chile (+56)","isoCountry":"cl"}
        ,{"cdCountry":"86","nmCountry":"China (+86)","isoCountry":"ch"}
        ,{"cdCountry":"57","nmCountry":"Colombia (+57)","isoCountry":"co"}
        ,{"cdCountry":"269","nmCountry":"Comoros (+269)","isoCountry":"km"}
        ,{"cdCountry":"242","nmCountry":"Congo (+242)","isoCountry":"cg"}
        ,{"cdCountry":"682","nmCountry":"Cook Islands (+682)","isoCountry":"ck"}
        ,{"cdCountry":"506","nmCountry":"Costa Rica (+506)","isoCountry":"cr"}
        ,{"cdCountry":"385","nmCountry":"Croatia (+385)","isoCountry":"hr"}
        ,{"cdCountry":"53","nmCountry":"Cuba (+53)","isoCountry":"cy"}
        ,{"cdCountry":"90","nmCountry":"Cyprus - North (+90)","isoCountry":"un"}
        ,{"cdCountry":"357","nmCountry":"Cyprus - South (+357)","isoCountry":"cy"}
        ,{"cdCountry":"420","nmCountry":"Czech Republic (+420)","isoCountry":"cz"}
        ,{"cdCountry":"45","nmCountry":"Denmark (+45)","isoCountry":"dk"}
        ,{"cdCountry":"253","nmCountry":"Djibouti (+253)","isoCountry":"dj"}
        ,{"cdCountry":"1809","nmCountry":"Dominica (+1809)","isoCountry":"dm"}
        ,{"cdCountry":"1809","nmCountry":"Dominican Republic (+1809)","isoCountry":"do"}
        ,{"cdCountry":"593","nmCountry":"Ecuador (+593)","isoCountry":"ec"}
        ,{"cdCountry":"20","nmCountry":"Egypt (+20)","isoCountry":"eg"}
        ,{"cdCountry":"503","nmCountry":"El Salvador (+503)","isoCountry":"sv"}
        ,{"cdCountry":"240","nmCountry":"Equatorial Guinea (+240)","isoCountry":"gq"}
        ,{"cdCountry":"291","nmCountry":"Eritrea (+291)","isoCountry":"er"}
        ,{"cdCountry":"372","nmCountry":"Estonia (+372)","isoCountry":"ee"}
        ,{"cdCountry":"251","nmCountry":"Ethiopia (+251)","isoCountry":"et"}
        ,{"cdCountry":"500","nmCountry":"Falkland Islands (+500)","isoCountry":"fk"}
        ,{"cdCountry":"298","nmCountry":"Faroe Islands (+298)","isoCountry":"fo"}
        ,{"cdCountry":"679","nmCountry":"Fiji (+679)","isoCountry":"fj"}
        ,{"cdCountry":"358","nmCountry":"Finland (+358)","isoCountry":"fi"}
        ,{"cdCountry":"33","nmCountry":"France (+33)","isoCountry":"fr"}
        ,{"cdCountry":"594","nmCountry":"French Guiana (+594)","isoCountry":"gf"}
        ,{"cdCountry":"689","nmCountry":"French Polynesia (+689)","isoCountry":"pf"}
        ,{"cdCountry":"241","nmCountry":"Gabon (+241)","isoCountry":"ga"}
        ,{"cdCountry":"220","nmCountry":"Gambia (+220)","isoCountry":"gm"}
        ,{"cdCountry":"7880","nmCountry":"Georgia (+7880)","isoCountry":"ge"}
        ,{"cdCountry":"49","nmCountry":"Germany (+49)","isoCountry":"de"}
        ,{"cdCountry":"233","nmCountry":"Ghana (+233)","isoCountry":"gh"}
        ,{"cdCountry":"350","nmCountry":"Gibraltar (+350)","isoCountry":"gi"}
        ,{"cdCountry":"30","nmCountry":"Greece (+30)","isoCountry":"gr"}
        ,{"cdCountry":"299","nmCountry":"Greenland (+299)","isoCountry":"gl"}
        ,{"cdCountry":"1473","nmCountry":"Grenada (+1473)","isoCountry":"gd"}
        ,{"cdCountry":"590","nmCountry":"Guadeloupe (+590)","isoCountry":"gp"}
        ,{"cdCountry":"671","nmCountry":"Guam (+671)","isoCountry":"gu"}
        ,{"cdCountry":"502","nmCountry":"Guatemala (+502)","isoCountry":"gt"}
        ,{"cdCountry":"224","nmCountry":"Guinea (+224)","isoCountry":""}
        ,{"cdCountry":"245","nmCountry":"Guinea - Bissau (+245)","isoCountry":""}
        ,{"cdCountry":"592","nmCountry":"Guyana (+592)","isoCountry":""}
        ,{"cdCountry":"509","nmCountry":"Haiti (+509)","isoCountry":""}
        ,{"cdCountry":"504","nmCountry":"Honduras (+504)","isoCountry":""}
        ,{"cdCountry":"852","nmCountry":"Hong Kong (+852)","isoCountry":""}
        ,{"cdCountry":"36","nmCountry":"Hungary (+36)","isoCountry":""}
        ,{"cdCountry":"354","nmCountry":"Iceland (+354)","isoCountry":""}
        ,{"cdCountry":"91","nmCountry":"India (+91)","isoCountry":""}
        ,{"cdCountry":"62","nmCountry":"Indonesia (+62)","isoCountry":""}
        ,{"cdCountry":"964","nmCountry":"Iraq (+964)","isoCountry":""}
        ,{"cdCountry":"98","nmCountry":"Iran (+98)","isoCountry":""}
        ,{"cdCountry":"353","nmCountry":"Ireland (+353)","isoCountry":""}
        ,{"cdCountry":"972","nmCountry":"Israel (+972)","isoCountry":"il"}
        ,{"cdCountry":"39","nmCountry":"Italy (+39)","isoCountry":"it"}
        ,{"cdCountry":"1876","nmCountry":"Jamaica (+1876)","isoCountry":""}
        ,{"cdCountry":"81","nmCountry":"Japan (+81)","isoCountry":"jp"}
        ,{"cdCountry":"962","nmCountry":"Jordan (+962)","isoCountry":""}
        ,{"cdCountry":"7","nmCountry":"Kazakhstan (+7)","isoCountry":""}
        ,{"cdCountry":"254","nmCountry":"Kenya (+254)","isoCountry":""}
        ,{"cdCountry":"686","nmCountry":"Kiribati (+686)","isoCountry":""}
        ,{"cdCountry":"850","nmCountry":"Korea - North (+850)","isoCountry":""}
        ,{"cdCountry":"82","nmCountry":"Korea - South (+82)","isoCountry":""}
        ,{"cdCountry":"965","nmCountry":"Kuwait (+965)","isoCountry":""}
        ,{"cdCountry":"996","nmCountry":"Kyrgyzstan (+996)","isoCountry":""}
        ,{"cdCountry":"856","nmCountry":"Laos (+856)","isoCountry":""}
        ,{"cdCountry":"371","nmCountry":"Latvia (+371)","isoCountry":""}
        ,{"cdCountry":"961","nmCountry":"Lebanon (+961)","isoCountry":""}
        ,{"cdCountry":"266","nmCountry":"Lesotho (+266)","isoCountry":""}
        ,{"cdCountry":"231","nmCountry":"Liberia (+231)","isoCountry":""}
        ,{"cdCountry":"218","nmCountry":"Libya (+218)","isoCountry":""}
        ,{"cdCountry":"417","nmCountry":"Liechtenstein (+417)","isoCountry":""}
        ,{"cdCountry":"370","nmCountry":"Lithuania (+370)","isoCountry":""}
        ,{"cdCountry":"352","nmCountry":"Luxembourg (+352)","isoCountry":""}
        ,{"cdCountry":"853","nmCountry":"Macao (+853)","isoCountry":""}
        ,{"cdCountry":"389","nmCountry":"Macedonia (+389)","isoCountry":""}
        ,{"cdCountry":"261","nmCountry":"Madagascar (+261)","isoCountry":""}
        ,{"cdCountry":"265","nmCountry":"Malawi (+265)","isoCountry":""}
        ,{"cdCountry":"60","nmCountry":"Malaysia (+60)","isoCountry":""}
        ,{"cdCountry":"960","nmCountry":"Maldives (+960)","isoCountry":""}
        ,{"cdCountry":"223","nmCountry":"Mali (+223)","isoCountry":""}
        ,{"cdCountry":"356","nmCountry":"Malta (+356)","isoCountry":""}
        ,{"cdCountry":"692","nmCountry":"Marshall Islands (+692)","isoCountry":""}
        ,{"cdCountry":"596","nmCountry":"Martinique (+596)","isoCountry":""}
        ,{"cdCountry":"222","nmCountry":"Mauritania (+222)","isoCountry":""}
        ,{"cdCountry":"269","nmCountry":"Mayotte (+269)","isoCountry":""}
        ,{"cdCountry":"52","nmCountry":"Mexico (+52)","isoCountry":"mx"}
        ,{"cdCountry":"691","nmCountry":"Micronesia (+691)","isoCountry":"fm"}
        ,{"cdCountry":"373","nmCountry":"Moldova (+373)","isoCountry":""}
        ,{"cdCountry":"377","nmCountry":"Monaco (+377)","isoCountry":""}
        ,{"cdCountry":"976","nmCountry":"Mongolia (+976)","isoCountry":""}
        ,{"cdCountry":"1664","nmCountry":"Montserrat (+1664)","isoCountry":""}
        ,{"cdCountry":"212","nmCountry":"Morocco (+212)","isoCountry":""}
        ,{"cdCountry":"258","nmCountry":"Mozambique (+258)","isoCountry":""}
        ,{"cdCountry":"95","nmCountry":"Myanmar (+95)","isoCountry":""}
        ,{"cdCountry":"264","nmCountry":"Namibia (+264)","isoCountry":""}
        ,{"cdCountry":"674","nmCountry":"Nauru (+674)","isoCountry":""}
        ,{"cdCountry":"977","nmCountry":"Nepal (+977)","isoCountry":""}
        ,{"cdCountry":"31","nmCountry":"Netherlands (+31)","isoCountry":""}
        ,{"cdCountry":"687","nmCountry":"New Caledonia (+687)","isoCountry":""}
        ,{"cdCountry":"505","nmCountry":"Nicaragua (+505)","isoCountry":""}
        ,{"cdCountry":"227","nmCountry":"Niger (+227)","isoCountry":""}
        ,{"cdCountry":"234","nmCountry":"Nigeria (+234)","isoCountry":""}
        ,{"cdCountry":"683","nmCountry":"Niue (+683)","isoCountry":""}
        ,{"cdCountry":"672","nmCountry":"Norfolk Islands (+672)","isoCountry":""}
        ,{"cdCountry":"670","nmCountry":"Northern Marianas (+670)","isoCountry":""}
        ,{"cdCountry":"47","nmCountry":"Norway (+47)","isoCountry":"no"}
        ,{"cdCountry":"968","nmCountry":"Oman (+968)","isoCountry":""}
        ,{"cdCountry":"92","nmCountry":"Pakistan (+92)","isoCountry":""}
        ,{"cdCountry":"680","nmCountry":"Palau (+680)","isoCountry":""}
        ,{"cdCountry":"507","nmCountry":"Panama (+507)","isoCountry":""}
        ,{"cdCountry":"675","nmCountry":"Papua New Guinea (+675)","isoCountry":""}
        ,{"cdCountry":"595","nmCountry":"Paraguay (+595)","isoCountry":""}
        ,{"cdCountry":"51","nmCountry":"Peru (+51)","isoCountry":""}
        ,{"cdCountry":"63","nmCountry":"Philippines (+63)","isoCountry":""}
        ,{"cdCountry":"48","nmCountry":"Poland (+48)","isoCountry":""}
        ,{"cdCountry":"351","nmCountry":"Portugal (+351)","isoCountry":""}
        ,{"cdCountry":"1787","nmCountry":"Puerto Rico (+1787)","isoCountry":""}
        ,{"cdCountry":"974","nmCountry":"Qatar (+974)","isoCountry":""}
        ,{"cdCountry":"262","nmCountry":"Reunion (+262)","isoCountry":""}
        ,{"cdCountry":"40","nmCountry":"Romania (+40)","isoCountry":""}
        ,{"cdCountry":"7","nmCountry":"Russia (+7)","isoCountry":""}
        ,{"cdCountry":"250","nmCountry":"Rwanda (+250)","isoCountry":""}
        ,{"cdCountry":"378","nmCountry":"San Marino (+378)","isoCountry":""}
        ,{"cdCountry":"239","nmCountry":"Sao Tome &amp; Principe (+239)","isoCountry":""}
        ,{"cdCountry":"966","nmCountry":"Saudi Arabia (+966)","isoCountry":""}
        ,{"cdCountry":"221","nmCountry":"Senegal (+221)","isoCountry":""}
        ,{"cdCountry":"381","nmCountry":"Serbia (+381)","isoCountry":""}
        ,{"cdCountry":"248","nmCountry":"Seychelles (+248)","isoCountry":""}
        ,{"cdCountry":"232","nmCountry":"Sierra Leone (+232)","isoCountry":""}
        ,{"cdCountry":"65","nmCountry":"Singapore (+65)","isoCountry":""}
        ,{"cdCountry":"421","nmCountry":"Slovak Republic (+421)","isoCountry":""}
        ,{"cdCountry":"386","nmCountry":"Slovenia (+386)","isoCountry":""}
        ,{"cdCountry":"677","nmCountry":"Solomon Islands (+677)","isoCountry":""}
        ,{"cdCountry":"252","nmCountry":"Somalia (+252)","isoCountry":""}
        ,{"cdCountry":"27","nmCountry":"South Africa (+27)","isoCountry":""}
        ,{"cdCountry":"34","nmCountry":"Spain (+34)","isoCountry":""}
        ,{"cdCountry":"94","nmCountry":"Sri Lanka (+94)","isoCountry":""}
        ,{"cdCountry":"290","nmCountry":"St. Helena (+290)","isoCountry":""}
        ,{"cdCountry":"1869","nmCountry":"St. Kitts (+1869)","isoCountry":""}
        ,{"cdCountry":"1758","nmCountry":"St. Lucia (+1758)","isoCountry":""}
        ,{"cdCountry":"597","nmCountry":"Suriname (+597)","isoCountry":""}
        ,{"cdCountry":"249","nmCountry":"Sudan (+249)","isoCountry":""}
        ,{"cdCountry":"268","nmCountry":"Swaziland (+268)","isoCountry":""}
        ,{"cdCountry":"46","nmCountry":"Sweden (+46)","isoCountry":""}
        ,{"cdCountry":"41","nmCountry":"Switzerland (+41)","isoCountry":""}
        ,{"cdCountry":"963","nmCountry":"Syria (+963)","isoCountry":""}
        ,{"cdCountry":"886","nmCountry":"Taiwan (+886)","isoCountry":""}
        ,{"cdCountry":"992","nmCountry":"Tajikistan (+992)","isoCountry":""}
        ,{"cdCountry":"66","nmCountry":"Thailand (+66)","isoCountry":""}
        ,{"cdCountry":"228","nmCountry":"Togo (+228)","isoCountry":""}
        ,{"cdCountry":"676","nmCountry":"Tonga (+676)","isoCountry":""}
        ,{"cdCountry":"1868","nmCountry":"Trinidad &amp; Tobago (+1868)","isoCountry":""}
        ,{"cdCountry":"216","nmCountry":"Tunisia (+216)","isoCountry":""}
        ,{"cdCountry":"90","nmCountry":"Turkey (+90)","isoCountry":""}
        ,{"cdCountry":"993","nmCountry":"Turkmenistan (+993)","isoCountry":""}
        ,{"cdCountry":"1649","nmCountry":"Turks &amp; Caicos Islands (+1649)","isoCountry":""}
        ,{"cdCountry":"688","nmCountry":"Tuvalu (+688)","isoCountry":""}
        ,{"cdCountry":"256","nmCountry":"Uganda (+256)","isoCountry":""}
        ,{"cdCountry":"380","nmCountry":"Ukraine (+380)","isoCountry":""}
        ,{"cdCountry":"971","nmCountry":"United Arab Emirates (+971)","isoCountry":""}
        ,{"cdCountry":"598","nmCountry":"Uruguay (+598)","isoCountry":"uy"}
        ,{"cdCountry":"998","nmCountry":"Uzbekistan (+998)","isoCountry":""}
        ,{"cdCountry":"678","nmCountry":"Vanuatu (+678)","isoCountry":""}
        ,{"cdCountry":"379","nmCountry":"Vatican City (+379)","isoCountry":""}
        ,{"cdCountry":"58","nmCountry":"Venezuela (+58)","isoCountry":""}
        ,{"cdCountry":"84","nmCountry":"Vietnam (+84)","isoCountry":""}
        ,{"cdCountry":"1","nmCountry":"Virgin Islands - British (+1)","isoCountry":""}
        ,{"cdCountry":"1","nmCountry":"Virgin Islands - US (+1)","isoCountry":""}
        ,{"cdCountry":"681","nmCountry":"Wallis &amp; Futuna (+681)","isoCountry":""}
        ,{"cdCountry":"969","nmCountry":"Yemen (North)(+969)","isoCountry":""}
        ,{"cdCountry":"967","nmCountry":"Yemen (South)(+967)","isoCountry":""}
        ,{"cdCountry":"260","nmCountry":"Zambia (+260)","isoCountry":""}
        ,{"cdCountry":"263","nmCountry":"Zimbabwe (+263)","isoCountry":""}
        ];
    var ddi = {Ddi};
    var ddi_1 = ddi.Ddi;

    /* src\Phone.svelte generated by Svelte v3.12.1 */

    const file$2 = "src\\Phone.svelte";

    function get_each_context(ctx, list, i) {
    	const child_ctx = Object.create(ctx);
    	child_ctx.iCountry = list[i];
    	return child_ctx;
    }

    // (36:4) {#if visible}
    function create_if_block(ctx) {
    	var div0, t_1, div1, div1_intro, div1_outro, current, dispose;

    	let each_value = ctx.ddiList;

    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			div0 = element("div");
    			div0.textContent = " ";
    			t_1 = space();
    			div1 = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}
    			attr_dev(div0, "class", "background svelte-rxf6v");
    			add_location(div0, file$2, 36, 8, 2471);
    			attr_dev(div1, "class", "options-fake  svelte-rxf6v");
    			add_location(div1, file$2, 37, 12, 2538);
    			dispose = listen_dev(div0, "click", ctx.close);
    		},

    		m: function mount(target, anchor) {
    			insert_dev(target, div0, anchor);
    			insert_dev(target, t_1, anchor);
    			insert_dev(target, div1, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div1, null);
    			}

    			current = true;
    		},

    		p: function update(changed, ctx) {
    			if (changed.ddiList || changed.ddi) {
    				each_value = ctx.ddiList;

    				let i;
    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(changed, child_ctx);
    					} else {
    						each_blocks[i] = create_each_block(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(div1, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}
    				each_blocks.length = each_value.length;
    			}
    		},

    		i: function intro(local) {
    			if (current) return;
    			add_render_callback(() => {
    				if (div1_outro) div1_outro.end(1);
    				if (!div1_intro) div1_intro = create_in_transition(div1, fly, {});
    				div1_intro.start();
    			});

    			current = true;
    		},

    		o: function outro(local) {
    			if (div1_intro) div1_intro.invalidate();

    			div1_outro = create_out_transition(div1, fade, {});

    			current = false;
    		},

    		d: function destroy(detaching) {
    			if (detaching) {
    				detach_dev(div0);
    				detach_dev(t_1);
    				detach_dev(div1);
    			}

    			destroy_each(each_blocks, detaching);

    			if (detaching) {
    				if (div1_outro) div1_outro.end();
    			}

    			dispose();
    		}
    	};
    	dispatch_dev("SvelteRegisterBlock", { block, id: create_if_block.name, type: "if", source: "(36:4) {#if visible}", ctx });
    	return block;
    }

    // (39:16) {#each ddiList as iCountry}
    function create_each_block(ctx) {
    	var div, input, t0, label, span, t1_value = ctx.iCountry.nmCountry + "", t1, t2, dispose;

    	const block = {
    		c: function create() {
    			div = element("div");
    			input = element("input");
    			t0 = space();
    			label = element("label");
    			span = element("span");
    			t1 = text(t1_value);
    			t2 = space();
    			ctx.$$binding_groups[0].push(input);
    			attr_dev(input, "type", "radio");
    			attr_dev(input, "name", "ddi");
    			attr_dev(input, "id", "opt-" + ctx.iCountry.cdCountry);
    			input.__value = ctx.iCountry.cdCountry;
    			input.value = input.__value;
    			attr_dev(input, "class", "svelte-rxf6v");
    			add_location(input, file$2, 40, 24, 2699);
    			attr_dev(span, "class", "flag-icon flag-icon-" + ctx.iCountry.isoCountry + " svelte-rxf6v");
    			add_location(span, file$2, 41, 62, 2897);
    			attr_dev(label, "for", "opt-" + ctx.iCountry.cdCountry);
    			attr_dev(label, "class", "svelte-rxf6v");
    			add_location(label, file$2, 41, 24, 2859);
    			attr_dev(div, "class", "option-fake svelte-rxf6v");
    			add_location(div, file$2, 39, 20, 2648);

    			dispose = [
    				listen_dev(input, "change", ctx.input_change_handler),
    				listen_dev(input, "change", ctx.clickCountry)
    			];
    		},

    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, input);

    			input.checked = input.__value === ctx.ddi;

    			append_dev(div, t0);
    			append_dev(div, label);
    			append_dev(label, span);
    			append_dev(label, t1);
    			append_dev(div, t2);
    		},

    		p: function update(changed, ctx) {
    			if (changed.ddi) input.checked = input.__value === ctx.ddi;
    		},

    		d: function destroy(detaching) {
    			if (detaching) {
    				detach_dev(div);
    			}

    			ctx.$$binding_groups[0].splice(ctx.$$binding_groups[0].indexOf(input), 1);
    			run_all(dispose);
    		}
    	};
    	dispatch_dev("SvelteRegisterBlock", { block, id: create_each_block.name, type: "each", source: "(39:16) {#each ddiList as iCountry}", ctx });
    	return block;
    }

    function create_fragment$2(ctx) {
    	var div1, div0, input0, input0_id_value, input0_value_value, t0, label, span, span_class_value, t1_value = ctx.country.nmCountry + "", t1, label_for_value, t2, t3, input1, current, dispose;

    	var if_block = (ctx.visible) && create_if_block(ctx);

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			div0 = element("div");
    			input0 = element("input");
    			t0 = space();
    			label = element("label");
    			span = element("span");
    			t1 = text(t1_value);
    			t2 = space();
    			if (if_block) if_block.c();
    			t3 = space();
    			input1 = element("input");
    			ctx.$$binding_groups[0].push(input0);
    			attr_dev(input0, "type", "radio");
    			attr_dev(input0, "name", "ddi");
    			attr_dev(input0, "id", input0_id_value = "opt-" + ctx.country.cdCountry);
    			input0.__value = input0_value_value = ctx.country.cdCountry;
    			input0.value = input0.__value;
    			attr_dev(input0, "class", "svelte-rxf6v");
    			add_location(input0, file$2, 31, 12, 2161);
    			attr_dev(span, "class", span_class_value = "flag-icon flag-icon-" + ctx.country.isoCountry + " svelte-rxf6v");
    			add_location(span, file$2, 32, 49, 2317);
    			attr_dev(label, "for", label_for_value = "opt-" + ctx.country.cdCountry);
    			attr_dev(label, "class", "svelte-rxf6v");
    			add_location(label, file$2, 32, 12, 2280);
    			attr_dev(div0, "class", "option-fake selected svelte-rxf6v");
    			add_location(div0, file$2, 30, 8, 2113);
    			attr_dev(div1, "class", "wafield select-fake svelte-rxf6v");
    			add_location(div1, file$2, 29, 5, 2041);
    			attr_dev(input1, "class", "wafield form-input mt-1 w-1000  svelte-rxf6v");
    			attr_dev(input1, "id", "tel");
    			attr_dev(input1, "type", "tel");
    			attr_dev(input1, "placeholder", "Phone");
    			attr_dev(input1, "size", "9");
    			add_location(input1, file$2, 48, 0, 3086);

    			dispose = [
    				listen_dev(input0, "change", ctx.input0_change_handler),
    				listen_dev(div1, "click", ctx.clickList),
    				listen_dev(input1, "input", ctx.input1_input_handler)
    			];
    		},

    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},

    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, div0);
    			append_dev(div0, input0);

    			input0.checked = input0.__value === ctx.ddi;

    			append_dev(div0, t0);
    			append_dev(div0, label);
    			append_dev(label, span);
    			append_dev(label, t1);
    			insert_dev(target, t2, anchor);
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, t3, anchor);
    			insert_dev(target, input1, anchor);

    			set_input_value(input1, ctx.phone);

    			current = true;
    		},

    		p: function update(changed, ctx) {
    			if (changed.ddi) input0.checked = input0.__value === ctx.ddi;

    			if ((!current || changed.country) && input0_id_value !== (input0_id_value = "opt-" + ctx.country.cdCountry)) {
    				attr_dev(input0, "id", input0_id_value);
    			}

    			if ((!current || changed.country) && input0_value_value !== (input0_value_value = ctx.country.cdCountry)) {
    				prop_dev(input0, "__value", input0_value_value);
    			}

    			input0.value = input0.__value;

    			if ((!current || changed.country) && span_class_value !== (span_class_value = "flag-icon flag-icon-" + ctx.country.isoCountry + " svelte-rxf6v")) {
    				attr_dev(span, "class", span_class_value);
    			}

    			if ((!current || changed.country) && t1_value !== (t1_value = ctx.country.nmCountry + "")) {
    				set_data_dev(t1, t1_value);
    			}

    			if ((!current || changed.country) && label_for_value !== (label_for_value = "opt-" + ctx.country.cdCountry)) {
    				attr_dev(label, "for", label_for_value);
    			}

    			if (ctx.visible) {
    				if (if_block) {
    					if_block.p(changed, ctx);
    					transition_in(if_block, 1);
    				} else {
    					if_block = create_if_block(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(t3.parentNode, t3);
    				}
    			} else if (if_block) {
    				group_outros();
    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});
    				check_outros();
    			}

    			if (changed.phone) set_input_value(input1, ctx.phone);
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
    			if (detaching) {
    				detach_dev(div1);
    			}

    			ctx.$$binding_groups[0].splice(ctx.$$binding_groups[0].indexOf(input0), 1);

    			if (detaching) {
    				detach_dev(t2);
    			}

    			if (if_block) if_block.d(detaching);

    			if (detaching) {
    				detach_dev(t3);
    				detach_dev(input1);
    			}

    			run_all(dispose);
    		}
    	};
    	dispatch_dev("SvelteRegisterBlock", { block, id: create_fragment$2.name, type: "component", source: "", ctx });
    	return block;
    }

    function instance$2($$self, $$props, $$invalidate) {
    	
        let { ddi='', phone='' } = $$props;
        let country = {"cdCountry":"00","nmCountry":"None(nenhum)","isoCountry":"un"};
        let ddiList = ddi_1.ddiList;
        let findCountry = async (code)=>{
            const search = ddiList.filter((x)=>x.cdCountry===code);
            if(search.length>0){
                return search[0];
            }
            return {"cdCountry":"00","nmCountry":"notFound","isoCountry":"un"};
        };
        let retornaPais = async(code)=>{
            $$invalidate('country', country = await findCountry(code));
        };
        let visible = false;
        let clickList = ()=>{$$invalidate('visible', visible=true);};
        let clickCountry = async()=>{
            $$invalidate('country', country = await findCountry(ddi));
            $$invalidate('visible', visible=false);
        };
        let close = ()=>{$$invalidate('visible', visible=false);};

    	const writable_props = ['ddi', 'phone'];
    	Object.keys($$props).forEach(key => {
    		if (!writable_props.includes(key) && !key.startsWith('$$')) console.warn(`<Phone> was created with unknown prop '${key}'`);
    	});

    	const $$binding_groups = [[]];

    	function input0_change_handler() {
    		ddi = this.__value;
    		$$invalidate('ddi', ddi);
    	}

    	function input_change_handler() {
    		ddi = this.__value;
    		$$invalidate('ddi', ddi);
    	}

    	function input1_input_handler() {
    		phone = this.value;
    		$$invalidate('phone', phone);
    	}

    	$$self.$set = $$props => {
    		if ('ddi' in $$props) $$invalidate('ddi', ddi = $$props.ddi);
    		if ('phone' in $$props) $$invalidate('phone', phone = $$props.phone);
    	};

    	$$self.$capture_state = () => {
    		return { ddi, phone, country, ddiList, findCountry, retornaPais, visible, clickList, clickCountry, close };
    	};

    	$$self.$inject_state = $$props => {
    		if ('ddi' in $$props) $$invalidate('ddi', ddi = $$props.ddi);
    		if ('phone' in $$props) $$invalidate('phone', phone = $$props.phone);
    		if ('country' in $$props) $$invalidate('country', country = $$props.country);
    		if ('ddiList' in $$props) $$invalidate('ddiList', ddiList = $$props.ddiList);
    		if ('findCountry' in $$props) findCountry = $$props.findCountry;
    		if ('retornaPais' in $$props) retornaPais = $$props.retornaPais;
    		if ('visible' in $$props) $$invalidate('visible', visible = $$props.visible);
    		if ('clickList' in $$props) $$invalidate('clickList', clickList = $$props.clickList);
    		if ('clickCountry' in $$props) $$invalidate('clickCountry', clickCountry = $$props.clickCountry);
    		if ('close' in $$props) $$invalidate('close', close = $$props.close);
    	};

    	return {
    		ddi,
    		phone,
    		country,
    		ddiList,
    		visible,
    		clickList,
    		clickCountry,
    		close,
    		input0_change_handler,
    		input_change_handler,
    		input1_input_handler,
    		$$binding_groups
    	};
    }

    class Phone extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$2, create_fragment$2, safe_not_equal, ["ddi", "phone"]);
    		dispatch_dev("SvelteRegisterComponent", { component: this, tagName: "Phone", options, id: create_fragment$2.name });
    	}

    	get ddi() {
    		throw new Error("<Phone>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set ddi(value) {
    		throw new Error("<Phone>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get phone() {
    		throw new Error("<Phone>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set phone(value) {
    		throw new Error("<Phone>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\Head.svelte generated by Svelte v3.12.1 */

    const file$3 = "src\\Head.svelte";

    function create_fragment$3(ctx) {
    	var nav, div, span, t;

    	const block = {
    		c: function create() {
    			nav = element("nav");
    			div = element("div");
    			span = element("span");
    			t = text(ctx.titulo);
    			attr_dev(span, "class", "font-semibold text-xl tracking-tight");
    			add_location(span, file$3, 7, 4, 273);
    			attr_dev(div, "class", "flex w-500 items-center flex-shrink-0 text-white mr-6");
    			add_location(div, file$3, 6, 2, 196);
    			attr_dev(nav, "class", "flex items-center justify-between bg-teal-500 p-6 svelte-sdvzku");
    			add_location(nav, file$3, 5, 0, 129);
    		},

    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},

    		m: function mount(target, anchor) {
    			insert_dev(target, nav, anchor);
    			append_dev(nav, div);
    			append_dev(div, span);
    			append_dev(span, t);
    		},

    		p: function update(changed, ctx) {
    			if (changed.titulo) {
    				set_data_dev(t, ctx.titulo);
    			}
    		},

    		i: noop,
    		o: noop,

    		d: function destroy(detaching) {
    			if (detaching) {
    				detach_dev(nav);
    			}
    		}
    	};
    	dispatch_dev("SvelteRegisterBlock", { block, id: create_fragment$3.name, type: "component", source: "", ctx });
    	return block;
    }

    function instance$3($$self, $$props, $$invalidate) {
    	let { titulo } = $$props;

    	const writable_props = ['titulo'];
    	Object.keys($$props).forEach(key => {
    		if (!writable_props.includes(key) && !key.startsWith('$$')) console.warn(`<Head> was created with unknown prop '${key}'`);
    	});

    	$$self.$set = $$props => {
    		if ('titulo' in $$props) $$invalidate('titulo', titulo = $$props.titulo);
    	};

    	$$self.$capture_state = () => {
    		return { titulo };
    	};

    	$$self.$inject_state = $$props => {
    		if ('titulo' in $$props) $$invalidate('titulo', titulo = $$props.titulo);
    	};

    	return { titulo };
    }

    class Head extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$3, create_fragment$3, safe_not_equal, ["titulo"]);
    		dispatch_dev("SvelteRegisterComponent", { component: this, tagName: "Head", options, id: create_fragment$3.name });

    		const { ctx } = this.$$;
    		const props = options.props || {};
    		if (ctx.titulo === undefined && !('titulo' in props)) {
    			console.warn("<Head> was created without expected prop 'titulo'");
    		}
    	}

    	get titulo() {
    		throw new Error("<Head>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set titulo(value) {
    		throw new Error("<Head>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\App.svelte generated by Svelte v3.12.1 */

    const file$4 = "src\\App.svelte";

    function create_fragment$4(ctx) {
    	var title_value, t0, main, t1, div0, p0, t3, p1, t5, p2, t7, div1, updating_ddi, updating_phone, t8, t9, current;

    	document.title = title_value = tit;

    	var head = new Head({
    		props: { titulo: tit },
    		$$inline: true
    	});

    	function phone_1_ddi_binding(value) {
    		ctx.phone_1_ddi_binding.call(null, value);
    		updating_ddi = true;
    		add_flush_callback(() => updating_ddi = false);
    	}

    	function phone_1_phone_binding(value_1) {
    		ctx.phone_1_phone_binding.call(null, value_1);
    		updating_phone = true;
    		add_flush_callback(() => updating_phone = false);
    	}

    	let phone_1_props = {};
    	if (ctx.ddi !== void 0) {
    		phone_1_props.ddi = ctx.ddi;
    	}
    	if (ctx.phone !== void 0) {
    		phone_1_props.phone = ctx.phone;
    	}
    	var phone_1 = new Phone({ props: phone_1_props, $$inline: true });

    	binding_callbacks.push(() => bind(phone_1, 'ddi', phone_1_ddi_binding));
    	binding_callbacks.push(() => bind(phone_1, 'phone', phone_1_phone_binding));

    	var button = new Button({
    		props: { open: ctx.abreZap },
    		$$inline: true
    	});

    	var githubbutton = new GithubButton({
    		props: {
    		caption: "paiva-thiago",
    		url: "https://github.com/paiva-thiago/open-whats"
    	},
    		$$inline: true
    	});

    	const block = {
    		c: function create() {
    			t0 = space();
    			main = element("main");
    			head.$$.fragment.c();
    			t1 = space();
    			div0 = element("div");
    			p0 = element("p");
    			p0.textContent = "VOCÊ";
    			t3 = space();
    			p1 = element("p");
    			p1.textContent = "Já precisou mandar aquele zap pra aquele contato que você não quer adicionar??";
    			t5 = space();
    			p2 = element("p");
    			p2.textContent = "SEUS PROBLEMAS ACABARAM! - Chegou o OpenWhats! Selecione o código do país e preencha com o DDD + número, que o OpenWhats abre pra você!";
    			t7 = space();
    			div1 = element("div");
    			phone_1.$$.fragment.c();
    			t8 = space();
    			button.$$.fragment.c();
    			t9 = space();
    			githubbutton.$$.fragment.c();
    			attr_dev(p0, "class", "font-bold");
    			add_location(p0, file$4, 23, 3, 641);
    			attr_dev(p1, "class", "text-sm");
    			add_location(p1, file$4, 24, 3, 675);
    			attr_dev(p2, "class", "text-sm");
    			add_location(p2, file$4, 25, 3, 781);
    			attr_dev(div0, "class", "bg-teal-100 border-t border-b border-teal-500 text-teal-700 px-4 py-3 top-100 pb-100");
    			attr_dev(div0, "role", "alert");
    			add_location(div0, file$4, 22, 2, 525);
    			attr_dev(div1, "class", "bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4");
    			add_location(div1, file$4, 27, 1, 953);
    			add_location(main, file$4, 20, 0, 491);
    		},

    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},

    		m: function mount(target, anchor) {
    			insert_dev(target, t0, anchor);
    			insert_dev(target, main, anchor);
    			mount_component(head, main, null);
    			append_dev(main, t1);
    			append_dev(main, div0);
    			append_dev(div0, p0);
    			append_dev(div0, t3);
    			append_dev(div0, p1);
    			append_dev(div0, t5);
    			append_dev(div0, p2);
    			append_dev(main, t7);
    			append_dev(main, div1);
    			mount_component(phone_1, div1, null);
    			append_dev(div1, t8);
    			mount_component(button, div1, null);
    			append_dev(main, t9);
    			mount_component(githubbutton, main, null);
    			current = true;
    		},

    		p: function update(changed, ctx) {
    			if ((!current || changed.tit) && title_value !== (title_value = tit)) {
    				document.title = title_value;
    			}

    			var phone_1_changes = {};
    			if (!updating_ddi && changed.ddi) {
    				phone_1_changes.ddi = ctx.ddi;
    			}
    			if (!updating_phone && changed.phone) {
    				phone_1_changes.phone = ctx.phone;
    			}
    			phone_1.$set(phone_1_changes);
    		},

    		i: function intro(local) {
    			if (current) return;
    			transition_in(head.$$.fragment, local);

    			transition_in(phone_1.$$.fragment, local);

    			transition_in(button.$$.fragment, local);

    			transition_in(githubbutton.$$.fragment, local);

    			current = true;
    		},

    		o: function outro(local) {
    			transition_out(head.$$.fragment, local);
    			transition_out(phone_1.$$.fragment, local);
    			transition_out(button.$$.fragment, local);
    			transition_out(githubbutton.$$.fragment, local);
    			current = false;
    		},

    		d: function destroy(detaching) {
    			if (detaching) {
    				detach_dev(t0);
    				detach_dev(main);
    			}

    			destroy_component(head);

    			destroy_component(phone_1);

    			destroy_component(button);

    			destroy_component(githubbutton);
    		}
    	};
    	dispatch_dev("SvelteRegisterBlock", { block, id: create_fragment$4.name, type: "component", source: "", ctx });
    	return block;
    }

    let tit   = 'OpenWhats';

    function instance$4($$self, $$props, $$invalidate) {
    	
      let ddi   = '';
      let phone = '';
      const abreZap = ()=>{
        if((ddi.trim()!='')&&(phone.trim()!='')){
          window.open(`https://api.whatsapp.com/send?phone=${ddi}${phone}`);       
        } 
      };

    	function phone_1_ddi_binding(value) {
    		ddi = value;
    		$$invalidate('ddi', ddi);
    	}

    	function phone_1_phone_binding(value_1) {
    		phone = value_1;
    		$$invalidate('phone', phone);
    	}

    	$$self.$capture_state = () => {
    		return {};
    	};

    	$$self.$inject_state = $$props => {
    		if ('tit' in $$props) $$invalidate('tit', tit = $$props.tit);
    		if ('ddi' in $$props) $$invalidate('ddi', ddi = $$props.ddi);
    		if ('phone' in $$props) $$invalidate('phone', phone = $$props.phone);
    	};

    	return {
    		ddi,
    		phone,
    		abreZap,
    		phone_1_ddi_binding,
    		phone_1_phone_binding
    	};
    }

    class App extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$4, create_fragment$4, safe_not_equal, []);
    		dispatch_dev("SvelteRegisterComponent", { component: this, tagName: "App", options, id: create_fragment$4.name });
    	}
    }

    const app = new App({
        target: document.body
    });

}());
//# sourceMappingURL=main.js.map
