
(function(l, i, v, e) { v = l.createElement(i); v.async = 1; v.src = '//' + (location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; e = l.getElementsByTagName(i)[0]; e.parentNode.insertBefore(v, e)})(document, 'script');
(function () {
    'use strict';

    function noop() {}

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

    function append(target, node) {
    	target.appendChild(node);
    }

    function insert(target, node, anchor) {
    	target.insertBefore(node, anchor || null);
    }

    function detach(node) {
    	node.parentNode.removeChild(node);
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
    	if (value == null) node.removeAttribute(attribute);
    	else node.setAttribute(attribute, value);
    }

    function children(element) {
    	return Array.from(element.childNodes);
    }

    function set_data(text, data) {
    	data = '' + data;
    	if (text.data !== data) text.data = data;
    }

    function select_option(select, value) {
    	for (let i = 0; i < select.options.length; i += 1) {
    		const option = select.options[i];

    		if (option.__value === value) {
    			option.selected = true;
    			return;
    		}
    	}
    }

    function select_value(select) {
    	const selected_option = select.querySelector(':checked') || select.options[0];
    	return selected_option && selected_option.__value;
    }

    let current_component;

    function set_current_component(component) {
    	current_component = component;
    }

    const dirty_components = [];

    const resolved_promise = Promise.resolve();
    let update_scheduled = false;
    const binding_callbacks = [];
    const render_callbacks = [];
    const flush_callbacks = [];

    function schedule_update() {
    	if (!update_scheduled) {
    		update_scheduled = true;
    		resolved_promise.then(flush);
    	}
    }

    function add_binding_callback(fn) {
    	binding_callbacks.push(fn);
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

    		while (binding_callbacks.length) binding_callbacks.shift()();

    		// then, once components are updated, call
    		// afterUpdate functions. This may cause
    		// subsequent updates...
    		while (render_callbacks.length) {
    			const callback = render_callbacks.pop();
    			if (!seen_callbacks.has(callback)) {
    				callback();

    				// ...so guard against infinite loops
    				seen_callbacks.add(callback);
    			}
    		}
    	} while (dirty_components.length);

    	while (flush_callbacks.length) {
    		flush_callbacks.pop()();
    	}

    	update_scheduled = false;
    }

    function update($$) {
    	if ($$.fragment) {
    		$$.update($$.dirty);
    		run_all($$.before_render);
    		$$.fragment.p($$.dirty, $$.ctx);
    		$$.dirty = null;

    		$$.after_render.forEach(add_render_callback);
    	}
    }

    function bind(component, name, callback) {
    	if (component.$$.props.indexOf(name) === -1) return;
    	component.$$.bound[name] = callback;
    	callback(component.$$.ctx[name]);
    }

    function mount_component(component, target, anchor) {
    	const { fragment, on_mount, on_destroy, after_render } = component.$$;

    	fragment.m(target, anchor);

    	// onMount happens after the initial afterUpdate. Because
    	// afterUpdate callbacks happen in reverse order (inner first)
    	// we schedule onMount callbacks before afterUpdate callbacks
    	add_render_callback(() => {
    		const new_on_destroy = on_mount.map(run).filter(is_function);
    		if (on_destroy) {
    			on_destroy.push(...new_on_destroy);
    		} else {
    			// Edge case - component was destroyed immediately,
    			// most likely as a result of a binding initialising
    			run_all(new_on_destroy);
    		}
    		component.$$.on_mount = [];
    	});

    	after_render.forEach(add_render_callback);
    }

    function destroy(component, detaching) {
    	if (component.$$) {
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

    function init(component, options, instance, create_fragment, not_equal$$1, prop_names) {
    	const parent_component = current_component;
    	set_current_component(component);

    	const props = options.props || {};

    	const $$ = component.$$ = {
    		fragment: null,
    		ctx: null,

    		// state
    		props: prop_names,
    		update: noop,
    		not_equal: not_equal$$1,
    		bound: blank_object(),

    		// lifecycle
    		on_mount: [],
    		on_destroy: [],
    		before_render: [],
    		after_render: [],
    		context: new Map(parent_component ? parent_component.$$.context : []),

    		// everything else
    		callbacks: blank_object(),
    		dirty: null
    	};

    	let ready = false;

    	$$.ctx = instance
    		? instance(component, props, (key, value) => {
    			if ($$.ctx && not_equal$$1($$.ctx[key], $$.ctx[key] = value)) {
    				if ($$.bound[key]) $$.bound[key](value);
    				if (ready) make_dirty(component, key);
    			}
    		})
    		: props;

    	$$.update();
    	ready = true;
    	run_all($$.before_render);
    	$$.fragment = create_fragment($$.ctx);

    	if (options.target) {
    		if (options.hydrate) {
    			$$.fragment.l(children(options.target));
    		} else {
    			$$.fragment.c();
    		}

    		if (options.intro && component.$$.fragment.i) component.$$.fragment.i();
    		mount_component(component, options.target, options.anchor);
    		flush();
    	}

    	set_current_component(parent_component);
    }

    class SvelteComponent {
    	$destroy() {
    		destroy(this, true);
    		this.$destroy = noop;
    	}

    	$on(type, callback) {
    		const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
    		callbacks.push(callback);

    		return () => {
    			const index = callbacks.indexOf(callback);
    			if (index !== -1) callbacks.splice(index, 1);
    		};
    	}

    	$set() {
    		// overridden by instance, if it has props
    	}
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

    /* src\Button.svelte generated by Svelte v3.4.0 */

    const file = "src\\Button.svelte";

    function create_fragment(ctx) {
    	var button, dispose;

    	return {
    		c: function create() {
    			button = element("button");
    			button.textContent = "Open";
    			button.className = "color space border-none bg-teal-500 hover:bg-teal-400 rounded svelte-folwfl";
    			add_location(button, file, 6, 0, 126);
    			dispose = listen(button, "click", ctx.open);
    		},

    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},

    		m: function mount(target, anchor) {
    			insert(target, button, anchor);
    		},

    		p: noop,
    		i: noop,
    		o: noop,

    		d: function destroy(detaching) {
    			if (detaching) {
    				detach(button);
    			}

    			dispose();
    		}
    	};
    }

    function instance($$self, $$props, $$invalidate) {
    	let { open } = $$props;

    	$$self.$set = $$props => {
    		if ('open' in $$props) $$invalidate('open', open = $$props.open);
    	};

    	return { open };
    }

    class Button extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance, create_fragment, safe_not_equal, ["open"]);

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

    /* src\Phone.svelte generated by Svelte v3.4.0 */

    const file$1 = "src\\Phone.svelte";

    function create_fragment$1(ctx) {
    	var div1, select, option0, option1, option2, option3, option4, option5, option6, option7, option8, option9, option10, option11, option12, option13, option14, option15, option16, option17, option18, option19, option20, option21, option22, option23, option24, option25, option26, option27, option28, option29, option30, option31, option32, option33, option34, option35, option36, option37, option38, option39, option40, option41, option42, option43, option44, option45, option46, option47, option48, option49, option50, option51, option52, option53, option54, option55, option56, option57, option58, option59, option60, option61, option62, option63, option64, option65, option66, option67, option68, option69, option70, option71, option72, option73, option74, option75, option76, option77, option78, option79, option80, option81, option82, option83, option84, option85, option86, option87, option88, option89, option90, option91, option92, option93, option94, option95, option96, option97, option98, option99, option100, option101, option102, option103, option104, option105, option106, option107, option108, option109, option110, option111, option112, option113, option114, option115, option116, option117, option118, option119, option120, option121, option122, option123, option124, option125, option126, option127, option128, option129, option130, option131, option132, option133, option134, option135, option136, option137, option138, option139, option140, option141, option142, option143, option144, option145, option146, option147, option148, option149, option150, option151, option152, option153, option154, option155, option156, option157, option158, option159, option160, option161, option162, option163, option164, option165, option166, option167, option168, option169, option170, option171, option172, option173, option174, option175, option176, option177, option178, option179, option180, option181, option182, option183, option184, option185, option186, option187, option188, option189, option190, option191, option192, option193, option194, option195, option196, option197, option198, option199, option200, option201, option202, option203, option204, option205, option206, option207, option208, option209, option210, option211, option212, option213, option214, option215, t216, div0, svg, path, t217, input, dispose;

    	return {
    		c: function create() {
    			div1 = element("div");
    			select = element("select");
    			option0 = element("option");
    			option0.textContent = "DDI";
    			option1 = element("option");
    			option1.textContent = "Brazil (+55)";
    			option2 = element("option");
    			option2.textContent = "New Zealand (+64)";
    			option3 = element("option");
    			option3.textContent = "Australia (+61)";
    			option4 = element("option");
    			option4.textContent = "USA (+1)";
    			option5 = element("option");
    			option5.textContent = "UK (+44)";
    			option6 = element("option");
    			option6.textContent = "Outros";
    			option7 = element("option");
    			option7.textContent = "Algeria (+213)";
    			option8 = element("option");
    			option8.textContent = "Andorra (+376)";
    			option9 = element("option");
    			option9.textContent = "Angola (+244)";
    			option10 = element("option");
    			option10.textContent = "Anguilla (+1264)";
    			option11 = element("option");
    			option11.textContent = "Antigua & Barbuda (+1268)";
    			option12 = element("option");
    			option12.textContent = "Argentina (+54)";
    			option13 = element("option");
    			option13.textContent = "Armenia (+374)";
    			option14 = element("option");
    			option14.textContent = "Aruba (+297)";
    			option15 = element("option");
    			option15.textContent = "Austria (+43)";
    			option16 = element("option");
    			option16.textContent = "Azerbaijan (+994)";
    			option17 = element("option");
    			option17.textContent = "Bahamas (+1242)";
    			option18 = element("option");
    			option18.textContent = "Bahrain (+973)";
    			option19 = element("option");
    			option19.textContent = "Bangladesh (+880)";
    			option20 = element("option");
    			option20.textContent = "Barbados (+1246)";
    			option21 = element("option");
    			option21.textContent = "Belarus (+375)";
    			option22 = element("option");
    			option22.textContent = "Belgium (+32)";
    			option23 = element("option");
    			option23.textContent = "Belize (+501)";
    			option24 = element("option");
    			option24.textContent = "Benin (+229)";
    			option25 = element("option");
    			option25.textContent = "Bermuda (+1441)";
    			option26 = element("option");
    			option26.textContent = "Bhutan (+975)";
    			option27 = element("option");
    			option27.textContent = "Bolivia (+591)";
    			option28 = element("option");
    			option28.textContent = "Bosnia Herzegovina (+387)";
    			option29 = element("option");
    			option29.textContent = "Botswana (+267)";
    			option30 = element("option");
    			option30.textContent = "Brunei (+673)";
    			option31 = element("option");
    			option31.textContent = "Bulgaria (+359)";
    			option32 = element("option");
    			option32.textContent = "Burkina Faso (+226)";
    			option33 = element("option");
    			option33.textContent = "Burundi (+257)";
    			option34 = element("option");
    			option34.textContent = "Cambodia (+855)";
    			option35 = element("option");
    			option35.textContent = "Cameroon (+237)";
    			option36 = element("option");
    			option36.textContent = "Canada (+1)";
    			option37 = element("option");
    			option37.textContent = "Cape Verde Islands (+238)";
    			option38 = element("option");
    			option38.textContent = "Cayman Islands (+1345)";
    			option39 = element("option");
    			option39.textContent = "Central African Republic (+236)";
    			option40 = element("option");
    			option40.textContent = "Chile (+56)";
    			option41 = element("option");
    			option41.textContent = "China (+86)";
    			option42 = element("option");
    			option42.textContent = "Colombia (+57)";
    			option43 = element("option");
    			option43.textContent = "Comoros (+269)";
    			option44 = element("option");
    			option44.textContent = "Congo (+242)";
    			option45 = element("option");
    			option45.textContent = "Cook Islands (+682)";
    			option46 = element("option");
    			option46.textContent = "Costa Rica (+506)";
    			option47 = element("option");
    			option47.textContent = "Croatia (+385)";
    			option48 = element("option");
    			option48.textContent = "Cuba (+53)";
    			option49 = element("option");
    			option49.textContent = "Cyprus - North (+90)";
    			option50 = element("option");
    			option50.textContent = "Cyprus - South (+357)";
    			option51 = element("option");
    			option51.textContent = "Czech Republic (+420)";
    			option52 = element("option");
    			option52.textContent = "Denmark (+45)";
    			option53 = element("option");
    			option53.textContent = "Djibouti (+253)";
    			option54 = element("option");
    			option54.textContent = "Dominica (+1809)";
    			option55 = element("option");
    			option55.textContent = "Dominican Republic (+1809)";
    			option56 = element("option");
    			option56.textContent = "Ecuador (+593)";
    			option57 = element("option");
    			option57.textContent = "Egypt (+20)";
    			option58 = element("option");
    			option58.textContent = "El Salvador (+503)";
    			option59 = element("option");
    			option59.textContent = "Equatorial Guinea (+240)";
    			option60 = element("option");
    			option60.textContent = "Eritrea (+291)";
    			option61 = element("option");
    			option61.textContent = "Estonia (+372)";
    			option62 = element("option");
    			option62.textContent = "Ethiopia (+251)";
    			option63 = element("option");
    			option63.textContent = "Falkland Islands (+500)";
    			option64 = element("option");
    			option64.textContent = "Faroe Islands (+298)";
    			option65 = element("option");
    			option65.textContent = "Fiji (+679)";
    			option66 = element("option");
    			option66.textContent = "Finland (+358)";
    			option67 = element("option");
    			option67.textContent = "France (+33)";
    			option68 = element("option");
    			option68.textContent = "French Guiana (+594)";
    			option69 = element("option");
    			option69.textContent = "French Polynesia (+689)";
    			option70 = element("option");
    			option70.textContent = "Gabon (+241)";
    			option71 = element("option");
    			option71.textContent = "Gambia (+220)";
    			option72 = element("option");
    			option72.textContent = "Georgia (+7880)";
    			option73 = element("option");
    			option73.textContent = "Germany (+49)";
    			option74 = element("option");
    			option74.textContent = "Ghana (+233)";
    			option75 = element("option");
    			option75.textContent = "Gibraltar (+350)";
    			option76 = element("option");
    			option76.textContent = "Greece (+30)";
    			option77 = element("option");
    			option77.textContent = "Greenland (+299)";
    			option78 = element("option");
    			option78.textContent = "Grenada (+1473)";
    			option79 = element("option");
    			option79.textContent = "Guadeloupe (+590)";
    			option80 = element("option");
    			option80.textContent = "Guam (+671)";
    			option81 = element("option");
    			option81.textContent = "Guatemala (+502)";
    			option82 = element("option");
    			option82.textContent = "Guinea (+224)";
    			option83 = element("option");
    			option83.textContent = "Guinea - Bissau (+245)";
    			option84 = element("option");
    			option84.textContent = "Guyana (+592)";
    			option85 = element("option");
    			option85.textContent = "Haiti (+509)";
    			option86 = element("option");
    			option86.textContent = "Honduras (+504)";
    			option87 = element("option");
    			option87.textContent = "Hong Kong (+852)";
    			option88 = element("option");
    			option88.textContent = "Hungary (+36)";
    			option89 = element("option");
    			option89.textContent = "Iceland (+354)";
    			option90 = element("option");
    			option90.textContent = "India (+91)";
    			option91 = element("option");
    			option91.textContent = "Indonesia (+62)";
    			option92 = element("option");
    			option92.textContent = "Iraq (+964)";
    			option93 = element("option");
    			option93.textContent = "Iran (+98)";
    			option94 = element("option");
    			option94.textContent = "Ireland (+353)";
    			option95 = element("option");
    			option95.textContent = "Israel (+972)";
    			option96 = element("option");
    			option96.textContent = "Italy (+39)";
    			option97 = element("option");
    			option97.textContent = "Jamaica (+1876)";
    			option98 = element("option");
    			option98.textContent = "Japan (+81)";
    			option99 = element("option");
    			option99.textContent = "Jordan (+962)";
    			option100 = element("option");
    			option100.textContent = "Kazakhstan (+7)";
    			option101 = element("option");
    			option101.textContent = "Kenya (+254)";
    			option102 = element("option");
    			option102.textContent = "Kiribati (+686)";
    			option103 = element("option");
    			option103.textContent = "Korea - North (+850)";
    			option104 = element("option");
    			option104.textContent = "Korea - South (+82)";
    			option105 = element("option");
    			option105.textContent = "Kuwait (+965)";
    			option106 = element("option");
    			option106.textContent = "Kyrgyzstan (+996)";
    			option107 = element("option");
    			option107.textContent = "Laos (+856)";
    			option108 = element("option");
    			option108.textContent = "Latvia (+371)";
    			option109 = element("option");
    			option109.textContent = "Lebanon (+961)";
    			option110 = element("option");
    			option110.textContent = "Lesotho (+266)";
    			option111 = element("option");
    			option111.textContent = "Liberia (+231)";
    			option112 = element("option");
    			option112.textContent = "Libya (+218)";
    			option113 = element("option");
    			option113.textContent = "Liechtenstein (+417)";
    			option114 = element("option");
    			option114.textContent = "Lithuania (+370)";
    			option115 = element("option");
    			option115.textContent = "Luxembourg (+352)";
    			option116 = element("option");
    			option116.textContent = "Macao (+853)";
    			option117 = element("option");
    			option117.textContent = "Macedonia (+389)";
    			option118 = element("option");
    			option118.textContent = "Madagascar (+261)";
    			option119 = element("option");
    			option119.textContent = "Malawi (+265)";
    			option120 = element("option");
    			option120.textContent = "Malaysia (+60)";
    			option121 = element("option");
    			option121.textContent = "Maldives (+960)";
    			option122 = element("option");
    			option122.textContent = "Mali (+223)";
    			option123 = element("option");
    			option123.textContent = "Malta (+356)";
    			option124 = element("option");
    			option124.textContent = "Marshall Islands (+692)";
    			option125 = element("option");
    			option125.textContent = "Martinique (+596)";
    			option126 = element("option");
    			option126.textContent = "Mauritania (+222)";
    			option127 = element("option");
    			option127.textContent = "Mayotte (+269)";
    			option128 = element("option");
    			option128.textContent = "Mexico (+52)";
    			option129 = element("option");
    			option129.textContent = "Micronesia (+691)";
    			option130 = element("option");
    			option130.textContent = "Moldova (+373)";
    			option131 = element("option");
    			option131.textContent = "Monaco (+377)";
    			option132 = element("option");
    			option132.textContent = "Mongolia (+976)";
    			option133 = element("option");
    			option133.textContent = "Montserrat (+1664)";
    			option134 = element("option");
    			option134.textContent = "Morocco (+212)";
    			option135 = element("option");
    			option135.textContent = "Mozambique (+258)";
    			option136 = element("option");
    			option136.textContent = "Myanmar (+95)";
    			option137 = element("option");
    			option137.textContent = "Namibia (+264)";
    			option138 = element("option");
    			option138.textContent = "Nauru (+674)";
    			option139 = element("option");
    			option139.textContent = "Nepal (+977)";
    			option140 = element("option");
    			option140.textContent = "Netherlands (+31)";
    			option141 = element("option");
    			option141.textContent = "New Caledonia (+687)";
    			option142 = element("option");
    			option142.textContent = "Nicaragua (+505)";
    			option143 = element("option");
    			option143.textContent = "Niger (+227)";
    			option144 = element("option");
    			option144.textContent = "Nigeria (+234)";
    			option145 = element("option");
    			option145.textContent = "Niue (+683)";
    			option146 = element("option");
    			option146.textContent = "Norfolk Islands (+672)";
    			option147 = element("option");
    			option147.textContent = "Northern Marianas (+670)";
    			option148 = element("option");
    			option148.textContent = "Norway (+47)";
    			option149 = element("option");
    			option149.textContent = "Oman (+968)";
    			option150 = element("option");
    			option150.textContent = "Pakistan (+92)";
    			option151 = element("option");
    			option151.textContent = "Palau (+680)";
    			option152 = element("option");
    			option152.textContent = "Panama (+507)";
    			option153 = element("option");
    			option153.textContent = "Papua New Guinea (+675)";
    			option154 = element("option");
    			option154.textContent = "Paraguay (+595)";
    			option155 = element("option");
    			option155.textContent = "Peru (+51)";
    			option156 = element("option");
    			option156.textContent = "Philippines (+63)";
    			option157 = element("option");
    			option157.textContent = "Poland (+48)";
    			option158 = element("option");
    			option158.textContent = "Portugal (+351)";
    			option159 = element("option");
    			option159.textContent = "Puerto Rico (+1787)";
    			option160 = element("option");
    			option160.textContent = "Qatar (+974)";
    			option161 = element("option");
    			option161.textContent = "Reunion (+262)";
    			option162 = element("option");
    			option162.textContent = "Romania (+40)";
    			option163 = element("option");
    			option163.textContent = "Russia (+7)";
    			option164 = element("option");
    			option164.textContent = "Rwanda (+250)";
    			option165 = element("option");
    			option165.textContent = "San Marino (+378)";
    			option166 = element("option");
    			option166.textContent = "Sao Tome & Principe (+239)";
    			option167 = element("option");
    			option167.textContent = "Saudi Arabia (+966)";
    			option168 = element("option");
    			option168.textContent = "Senegal (+221)";
    			option169 = element("option");
    			option169.textContent = "Serbia (+381)";
    			option170 = element("option");
    			option170.textContent = "Seychelles (+248)";
    			option171 = element("option");
    			option171.textContent = "Sierra Leone (+232)";
    			option172 = element("option");
    			option172.textContent = "Singapore (+65)";
    			option173 = element("option");
    			option173.textContent = "Slovak Republic (+421)";
    			option174 = element("option");
    			option174.textContent = "Slovenia (+386)";
    			option175 = element("option");
    			option175.textContent = "Solomon Islands (+677)";
    			option176 = element("option");
    			option176.textContent = "Somalia (+252)";
    			option177 = element("option");
    			option177.textContent = "South Africa (+27)";
    			option178 = element("option");
    			option178.textContent = "Spain (+34)";
    			option179 = element("option");
    			option179.textContent = "Sri Lanka (+94)";
    			option180 = element("option");
    			option180.textContent = "St. Helena (+290)";
    			option181 = element("option");
    			option181.textContent = "St. Kitts (+1869)";
    			option182 = element("option");
    			option182.textContent = "St. Lucia (+1758)";
    			option183 = element("option");
    			option183.textContent = "Suriname (+597)";
    			option184 = element("option");
    			option184.textContent = "Sudan (+249)";
    			option185 = element("option");
    			option185.textContent = "Swaziland (+268)";
    			option186 = element("option");
    			option186.textContent = "Sweden (+46)";
    			option187 = element("option");
    			option187.textContent = "Switzerland (+41)";
    			option188 = element("option");
    			option188.textContent = "Syria (+963)";
    			option189 = element("option");
    			option189.textContent = "Taiwan (+886)";
    			option190 = element("option");
    			option190.textContent = "Tajikistan (+992)";
    			option191 = element("option");
    			option191.textContent = "Thailand (+66)";
    			option192 = element("option");
    			option192.textContent = "Togo (+228)";
    			option193 = element("option");
    			option193.textContent = "Tonga (+676)";
    			option194 = element("option");
    			option194.textContent = "Trinidad & Tobago (+1868)";
    			option195 = element("option");
    			option195.textContent = "Tunisia (+216)";
    			option196 = element("option");
    			option196.textContent = "Turkey (+90)";
    			option197 = element("option");
    			option197.textContent = "Turkmenistan (+993)";
    			option198 = element("option");
    			option198.textContent = "Turks & Caicos Islands (+1649)";
    			option199 = element("option");
    			option199.textContent = "Tuvalu (+688)";
    			option200 = element("option");
    			option200.textContent = "Uganda (+256)";
    			option201 = element("option");
    			option201.textContent = "Ukraine (+380)";
    			option202 = element("option");
    			option202.textContent = "United Arab Emirates (+971)";
    			option203 = element("option");
    			option203.textContent = "Uruguay (+598)";
    			option204 = element("option");
    			option204.textContent = "Uzbekistan (+998)";
    			option205 = element("option");
    			option205.textContent = "Vanuatu (+678)";
    			option206 = element("option");
    			option206.textContent = "Vatican City (+379)";
    			option207 = element("option");
    			option207.textContent = "Venezuela (+58)";
    			option208 = element("option");
    			option208.textContent = "Vietnam (+84)";
    			option209 = element("option");
    			option209.textContent = "Virgin Islands - British (+1)";
    			option210 = element("option");
    			option210.textContent = "Virgin Islands - US (+1)";
    			option211 = element("option");
    			option211.textContent = "Wallis & Futuna (+681)";
    			option212 = element("option");
    			option212.textContent = "Yemen (North)(+969)";
    			option213 = element("option");
    			option213.textContent = "Yemen (South)(+967)";
    			option214 = element("option");
    			option214.textContent = "Zambia (+260)";
    			option215 = element("option");
    			option215.textContent = "Zimbabwe (+263)";
    			t216 = space();
    			div0 = element("div");
    			svg = svg_element("svg");
    			path = svg_element("path");
    			t217 = space();
    			input = element("input");
    			option0.__value = "";
    			option0.value = option0.__value;
    			option0.selected = true;
    			add_location(option0, file$1, 6, 8, 328);
    			option1.__value = "55";
    			option1.value = option1.__value;
    			add_location(option1, file$1, 7, 8, 376);
    			option2.__value = "64";
    			option2.value = option2.__value;
    			add_location(option2, file$1, 8, 8, 426);
    			option3.__value = "61";
    			option3.value = option3.__value;
    			add_location(option3, file$1, 9, 8, 481);
    			option4.__value = "1";
    			option4.value = option4.__value;
    			add_location(option4, file$1, 10, 8, 534);
    			option5.__value = "44";
    			option5.value = option5.__value;
    			add_location(option5, file$1, 11, 8, 579);
    			option6.disabled = true;
    			option6.__value = "Outros";
    			option6.value = option6.__value;
    			add_location(option6, file$1, 12, 8, 625);
    			option7.__value = "213";
    			option7.value = option7.__value;
    			add_location(option7, file$1, 13, 8, 667);
    			option8.__value = "376";
    			option8.value = option8.__value;
    			add_location(option8, file$1, 14, 8, 720);
    			option9.__value = "244";
    			option9.value = option9.__value;
    			add_location(option9, file$1, 15, 8, 773);
    			option10.__value = "1264";
    			option10.value = option10.__value;
    			add_location(option10, file$1, 16, 8, 825);
    			option11.__value = "1268";
    			option11.value = option11.__value;
    			add_location(option11, file$1, 17, 8, 881);
    			option12.__value = "54";
    			option12.value = option12.__value;
    			add_location(option12, file$1, 18, 8, 950);
    			option13.__value = "374";
    			option13.value = option13.__value;
    			add_location(option13, file$1, 19, 8, 1003);
    			option14.__value = "297";
    			option14.value = option14.__value;
    			add_location(option14, file$1, 20, 8, 1056);
    			option15.__value = "43";
    			option15.value = option15.__value;
    			add_location(option15, file$1, 21, 8, 1107);
    			option16.__value = "994";
    			option16.value = option16.__value;
    			add_location(option16, file$1, 22, 8, 1158);
    			option17.__value = "1242";
    			option17.value = option17.__value;
    			add_location(option17, file$1, 23, 8, 1214);
    			option18.__value = "973";
    			option18.value = option18.__value;
    			add_location(option18, file$1, 24, 8, 1269);
    			option19.__value = "880";
    			option19.value = option19.__value;
    			add_location(option19, file$1, 25, 8, 1322);
    			option20.__value = "1246";
    			option20.value = option20.__value;
    			add_location(option20, file$1, 26, 8, 1378);
    			option21.__value = "375";
    			option21.value = option21.__value;
    			add_location(option21, file$1, 27, 8, 1434);
    			option22.__value = "32";
    			option22.value = option22.__value;
    			add_location(option22, file$1, 28, 8, 1487);
    			option23.__value = "501";
    			option23.value = option23.__value;
    			add_location(option23, file$1, 29, 8, 1538);
    			option24.__value = "229";
    			option24.value = option24.__value;
    			add_location(option24, file$1, 30, 8, 1590);
    			option25.__value = "1441";
    			option25.value = option25.__value;
    			add_location(option25, file$1, 31, 8, 1641);
    			option26.__value = "975";
    			option26.value = option26.__value;
    			add_location(option26, file$1, 32, 8, 1696);
    			option27.__value = "591";
    			option27.value = option27.__value;
    			add_location(option27, file$1, 33, 8, 1748);
    			option28.__value = "387";
    			option28.value = option28.__value;
    			add_location(option28, file$1, 34, 8, 1801);
    			option29.__value = "267";
    			option29.value = option29.__value;
    			add_location(option29, file$1, 35, 8, 1865);
    			option30.__value = "673";
    			option30.value = option30.__value;
    			add_location(option30, file$1, 36, 8, 1919);
    			option31.__value = "359";
    			option31.value = option31.__value;
    			add_location(option31, file$1, 37, 8, 1971);
    			option32.__value = "226";
    			option32.value = option32.__value;
    			add_location(option32, file$1, 38, 8, 2025);
    			option33.__value = "257";
    			option33.value = option33.__value;
    			add_location(option33, file$1, 39, 8, 2083);
    			option34.__value = "855";
    			option34.value = option34.__value;
    			add_location(option34, file$1, 40, 8, 2136);
    			option35.__value = "237";
    			option35.value = option35.__value;
    			add_location(option35, file$1, 41, 8, 2190);
    			option36.__value = "1";
    			option36.value = option36.__value;
    			add_location(option36, file$1, 42, 8, 2244);
    			option37.__value = "238";
    			option37.value = option37.__value;
    			add_location(option37, file$1, 43, 8, 2292);
    			option38.__value = "1345";
    			option38.value = option38.__value;
    			add_location(option38, file$1, 44, 8, 2356);
    			option39.__value = "236";
    			option39.value = option39.__value;
    			add_location(option39, file$1, 45, 8, 2418);
    			option40.__value = "56";
    			option40.value = option40.__value;
    			add_location(option40, file$1, 46, 8, 2488);
    			option41.__value = "86";
    			option41.value = option41.__value;
    			add_location(option41, file$1, 47, 8, 2537);
    			option42.__value = "57";
    			option42.value = option42.__value;
    			add_location(option42, file$1, 48, 8, 2586);
    			option43.__value = "269";
    			option43.value = option43.__value;
    			add_location(option43, file$1, 49, 8, 2638);
    			option44.__value = "242";
    			option44.value = option44.__value;
    			add_location(option44, file$1, 50, 8, 2691);
    			option45.__value = "682";
    			option45.value = option45.__value;
    			add_location(option45, file$1, 51, 8, 2742);
    			option46.__value = "506";
    			option46.value = option46.__value;
    			add_location(option46, file$1, 52, 8, 2800);
    			option47.__value = "385";
    			option47.value = option47.__value;
    			add_location(option47, file$1, 53, 8, 2856);
    			option48.__value = "53";
    			option48.value = option48.__value;
    			add_location(option48, file$1, 54, 8, 2909);
    			option49.__value = "90";
    			option49.value = option49.__value;
    			add_location(option49, file$1, 55, 8, 2957);
    			option50.__value = "357";
    			option50.value = option50.__value;
    			add_location(option50, file$1, 56, 8, 3015);
    			option51.__value = "420";
    			option51.value = option51.__value;
    			add_location(option51, file$1, 57, 8, 3075);
    			option52.__value = "45";
    			option52.value = option52.__value;
    			add_location(option52, file$1, 58, 8, 3135);
    			option53.__value = "253";
    			option53.value = option53.__value;
    			add_location(option53, file$1, 59, 8, 3186);
    			option54.__value = "1809";
    			option54.value = option54.__value;
    			add_location(option54, file$1, 60, 8, 3240);
    			option55.__value = "1809";
    			option55.value = option55.__value;
    			add_location(option55, file$1, 61, 8, 3296);
    			option56.__value = "593";
    			option56.value = option56.__value;
    			add_location(option56, file$1, 62, 8, 3362);
    			option57.__value = "20";
    			option57.value = option57.__value;
    			add_location(option57, file$1, 63, 8, 3415);
    			option58.__value = "503";
    			option58.value = option58.__value;
    			add_location(option58, file$1, 64, 8, 3464);
    			option59.__value = "240";
    			option59.value = option59.__value;
    			add_location(option59, file$1, 65, 8, 3521);
    			option60.__value = "291";
    			option60.value = option60.__value;
    			add_location(option60, file$1, 66, 8, 3584);
    			option61.__value = "372";
    			option61.value = option61.__value;
    			add_location(option61, file$1, 67, 8, 3637);
    			option62.__value = "251";
    			option62.value = option62.__value;
    			add_location(option62, file$1, 68, 8, 3690);
    			option63.__value = "500";
    			option63.value = option63.__value;
    			add_location(option63, file$1, 69, 8, 3744);
    			option64.__value = "298";
    			option64.value = option64.__value;
    			add_location(option64, file$1, 70, 8, 3806);
    			option65.__value = "679";
    			option65.value = option65.__value;
    			add_location(option65, file$1, 71, 8, 3865);
    			option66.__value = "358";
    			option66.value = option66.__value;
    			add_location(option66, file$1, 72, 8, 3915);
    			option67.__value = "33";
    			option67.value = option67.__value;
    			add_location(option67, file$1, 73, 8, 3968);
    			option68.__value = "594";
    			option68.value = option68.__value;
    			add_location(option68, file$1, 74, 8, 4018);
    			option69.__value = "689";
    			option69.value = option69.__value;
    			add_location(option69, file$1, 75, 8, 4077);
    			option70.__value = "241";
    			option70.value = option70.__value;
    			add_location(option70, file$1, 76, 8, 4139);
    			option71.__value = "220";
    			option71.value = option71.__value;
    			add_location(option71, file$1, 77, 8, 4190);
    			option72.__value = "7880";
    			option72.value = option72.__value;
    			add_location(option72, file$1, 78, 8, 4242);
    			option73.__value = "49";
    			option73.value = option73.__value;
    			add_location(option73, file$1, 79, 8, 4297);
    			option74.__value = "233";
    			option74.value = option74.__value;
    			add_location(option74, file$1, 80, 8, 4348);
    			option75.__value = "350";
    			option75.value = option75.__value;
    			add_location(option75, file$1, 81, 8, 4399);
    			option76.__value = "30";
    			option76.value = option76.__value;
    			add_location(option76, file$1, 82, 8, 4454);
    			option77.__value = "299";
    			option77.value = option77.__value;
    			add_location(option77, file$1, 83, 8, 4504);
    			option78.__value = "1473";
    			option78.value = option78.__value;
    			add_location(option78, file$1, 84, 8, 4559);
    			option79.__value = "590";
    			option79.value = option79.__value;
    			add_location(option79, file$1, 85, 8, 4614);
    			option80.__value = "671";
    			option80.value = option80.__value;
    			add_location(option80, file$1, 86, 8, 4670);
    			option81.__value = "502";
    			option81.value = option81.__value;
    			add_location(option81, file$1, 87, 8, 4720);
    			option82.__value = "224";
    			option82.value = option82.__value;
    			add_location(option82, file$1, 88, 8, 4775);
    			option83.__value = "245";
    			option83.value = option83.__value;
    			add_location(option83, file$1, 89, 8, 4827);
    			option84.__value = "592";
    			option84.value = option84.__value;
    			add_location(option84, file$1, 90, 8, 4888);
    			option85.__value = "509";
    			option85.value = option85.__value;
    			add_location(option85, file$1, 91, 8, 4940);
    			option86.__value = "504";
    			option86.value = option86.__value;
    			add_location(option86, file$1, 92, 8, 4991);
    			option87.__value = "852";
    			option87.value = option87.__value;
    			add_location(option87, file$1, 93, 8, 5045);
    			option88.__value = "36";
    			option88.value = option88.__value;
    			add_location(option88, file$1, 94, 8, 5100);
    			option89.__value = "354";
    			option89.value = option89.__value;
    			add_location(option89, file$1, 95, 8, 5151);
    			option90.__value = "91";
    			option90.value = option90.__value;
    			add_location(option90, file$1, 96, 8, 5204);
    			option91.__value = "62";
    			option91.value = option91.__value;
    			add_location(option91, file$1, 97, 8, 5253);
    			option92.__value = "964";
    			option92.value = option92.__value;
    			add_location(option92, file$1, 98, 8, 5306);
    			option93.__value = "98";
    			option93.value = option93.__value;
    			add_location(option93, file$1, 99, 8, 5356);
    			option94.__value = "353";
    			option94.value = option94.__value;
    			add_location(option94, file$1, 100, 8, 5404);
    			option95.__value = "972";
    			option95.value = option95.__value;
    			add_location(option95, file$1, 101, 8, 5457);
    			option96.__value = "39";
    			option96.value = option96.__value;
    			add_location(option96, file$1, 102, 8, 5509);
    			option97.__value = "1876";
    			option97.value = option97.__value;
    			add_location(option97, file$1, 103, 8, 5558);
    			option98.__value = "81";
    			option98.value = option98.__value;
    			add_location(option98, file$1, 104, 8, 5613);
    			option99.__value = "962";
    			option99.value = option99.__value;
    			add_location(option99, file$1, 105, 8, 5662);
    			option100.__value = "7";
    			option100.value = option100.__value;
    			add_location(option100, file$1, 106, 8, 5714);
    			option101.__value = "254";
    			option101.value = option101.__value;
    			add_location(option101, file$1, 107, 8, 5766);
    			option102.__value = "686";
    			option102.value = option102.__value;
    			add_location(option102, file$1, 108, 8, 5817);
    			option103.__value = "850";
    			option103.value = option103.__value;
    			add_location(option103, file$1, 109, 8, 5871);
    			option104.__value = "82";
    			option104.value = option104.__value;
    			add_location(option104, file$1, 110, 8, 5930);
    			option105.__value = "965";
    			option105.value = option105.__value;
    			add_location(option105, file$1, 111, 8, 5987);
    			option106.__value = "996";
    			option106.value = option106.__value;
    			add_location(option106, file$1, 112, 8, 6039);
    			option107.__value = "856";
    			option107.value = option107.__value;
    			add_location(option107, file$1, 113, 8, 6095);
    			option108.__value = "371";
    			option108.value = option108.__value;
    			add_location(option108, file$1, 114, 8, 6145);
    			option109.__value = "961";
    			option109.value = option109.__value;
    			add_location(option109, file$1, 115, 8, 6197);
    			option110.__value = "266";
    			option110.value = option110.__value;
    			add_location(option110, file$1, 116, 8, 6250);
    			option111.__value = "231";
    			option111.value = option111.__value;
    			add_location(option111, file$1, 117, 8, 6303);
    			option112.__value = "218";
    			option112.value = option112.__value;
    			add_location(option112, file$1, 118, 8, 6356);
    			option113.__value = "417";
    			option113.value = option113.__value;
    			add_location(option113, file$1, 119, 8, 6407);
    			option114.__value = "370";
    			option114.value = option114.__value;
    			add_location(option114, file$1, 120, 8, 6466);
    			option115.__value = "352";
    			option115.value = option115.__value;
    			add_location(option115, file$1, 121, 8, 6521);
    			option116.__value = "853";
    			option116.value = option116.__value;
    			add_location(option116, file$1, 122, 8, 6577);
    			option117.__value = "389";
    			option117.value = option117.__value;
    			add_location(option117, file$1, 123, 8, 6628);
    			option118.__value = "261";
    			option118.value = option118.__value;
    			add_location(option118, file$1, 124, 8, 6683);
    			option119.__value = "265";
    			option119.value = option119.__value;
    			add_location(option119, file$1, 125, 8, 6739);
    			option120.__value = "60";
    			option120.value = option120.__value;
    			add_location(option120, file$1, 126, 8, 6791);
    			option121.__value = "960";
    			option121.value = option121.__value;
    			add_location(option121, file$1, 127, 8, 6843);
    			option122.__value = "223";
    			option122.value = option122.__value;
    			add_location(option122, file$1, 128, 8, 6897);
    			option123.__value = "356";
    			option123.value = option123.__value;
    			add_location(option123, file$1, 129, 8, 6947);
    			option124.__value = "692";
    			option124.value = option124.__value;
    			add_location(option124, file$1, 130, 8, 6998);
    			option125.__value = "596";
    			option125.value = option125.__value;
    			add_location(option125, file$1, 131, 8, 7060);
    			option126.__value = "222";
    			option126.value = option126.__value;
    			add_location(option126, file$1, 132, 8, 7116);
    			option127.__value = "269";
    			option127.value = option127.__value;
    			add_location(option127, file$1, 133, 8, 7172);
    			option128.__value = "52";
    			option128.value = option128.__value;
    			add_location(option128, file$1, 134, 8, 7225);
    			option129.__value = "691";
    			option129.value = option129.__value;
    			add_location(option129, file$1, 135, 8, 7275);
    			option130.__value = "373";
    			option130.value = option130.__value;
    			add_location(option130, file$1, 136, 8, 7331);
    			option131.__value = "377";
    			option131.value = option131.__value;
    			add_location(option131, file$1, 137, 8, 7384);
    			option132.__value = "976";
    			option132.value = option132.__value;
    			add_location(option132, file$1, 138, 8, 7436);
    			option133.__value = "1664";
    			option133.value = option133.__value;
    			add_location(option133, file$1, 139, 8, 7490);
    			option134.__value = "212";
    			option134.value = option134.__value;
    			add_location(option134, file$1, 140, 8, 7548);
    			option135.__value = "258";
    			option135.value = option135.__value;
    			add_location(option135, file$1, 141, 8, 7601);
    			option136.__value = "95";
    			option136.value = option136.__value;
    			add_location(option136, file$1, 142, 8, 7657);
    			option137.__value = "264";
    			option137.value = option137.__value;
    			add_location(option137, file$1, 143, 8, 7708);
    			option138.__value = "674";
    			option138.value = option138.__value;
    			add_location(option138, file$1, 144, 8, 7761);
    			option139.__value = "977";
    			option139.value = option139.__value;
    			add_location(option139, file$1, 145, 8, 7812);
    			option140.__value = "31";
    			option140.value = option140.__value;
    			add_location(option140, file$1, 146, 8, 7863);
    			option141.__value = "687";
    			option141.value = option141.__value;
    			add_location(option141, file$1, 147, 8, 7918);
    			option142.__value = "505";
    			option142.value = option142.__value;
    			add_location(option142, file$1, 148, 8, 7977);
    			option143.__value = "227";
    			option143.value = option143.__value;
    			add_location(option143, file$1, 149, 8, 8032);
    			option144.__value = "234";
    			option144.value = option144.__value;
    			add_location(option144, file$1, 150, 8, 8083);
    			option145.__value = "683";
    			option145.value = option145.__value;
    			add_location(option145, file$1, 151, 8, 8136);
    			option146.__value = "672";
    			option146.value = option146.__value;
    			add_location(option146, file$1, 152, 8, 8186);
    			option147.__value = "670";
    			option147.value = option147.__value;
    			add_location(option147, file$1, 153, 8, 8247);
    			option148.__value = "47";
    			option148.value = option148.__value;
    			add_location(option148, file$1, 154, 8, 8310);
    			option149.__value = "968";
    			option149.value = option149.__value;
    			add_location(option149, file$1, 155, 8, 8360);
    			option150.__value = "92";
    			option150.value = option150.__value;
    			add_location(option150, file$1, 156, 8, 8410);
    			option151.__value = "680";
    			option151.value = option151.__value;
    			add_location(option151, file$1, 157, 8, 8462);
    			option152.__value = "507";
    			option152.value = option152.__value;
    			add_location(option152, file$1, 158, 8, 8513);
    			option153.__value = "675";
    			option153.value = option153.__value;
    			add_location(option153, file$1, 159, 8, 8565);
    			option154.__value = "595";
    			option154.value = option154.__value;
    			add_location(option154, file$1, 160, 8, 8627);
    			option155.__value = "51";
    			option155.value = option155.__value;
    			add_location(option155, file$1, 161, 8, 8681);
    			option156.__value = "63";
    			option156.value = option156.__value;
    			add_location(option156, file$1, 162, 8, 8729);
    			option157.__value = "48";
    			option157.value = option157.__value;
    			add_location(option157, file$1, 163, 8, 8784);
    			option158.__value = "351";
    			option158.value = option158.__value;
    			add_location(option158, file$1, 164, 8, 8834);
    			option159.__value = "1787";
    			option159.value = option159.__value;
    			add_location(option159, file$1, 165, 8, 8888);
    			option160.__value = "974";
    			option160.value = option160.__value;
    			add_location(option160, file$1, 166, 8, 8947);
    			option161.__value = "262";
    			option161.value = option161.__value;
    			add_location(option161, file$1, 167, 8, 8998);
    			option162.__value = "40";
    			option162.value = option162.__value;
    			add_location(option162, file$1, 168, 8, 9051);
    			option163.__value = "7";
    			option163.value = option163.__value;
    			add_location(option163, file$1, 169, 8, 9102);
    			option164.__value = "250";
    			option164.value = option164.__value;
    			add_location(option164, file$1, 170, 8, 9150);
    			option165.__value = "378";
    			option165.value = option165.__value;
    			add_location(option165, file$1, 171, 8, 9202);
    			option166.__value = "239";
    			option166.value = option166.__value;
    			add_location(option166, file$1, 172, 8, 9258);
    			option167.__value = "966";
    			option167.value = option167.__value;
    			add_location(option167, file$1, 173, 8, 9327);
    			option168.__value = "221";
    			option168.value = option168.__value;
    			add_location(option168, file$1, 174, 8, 9385);
    			option169.__value = "381";
    			option169.value = option169.__value;
    			add_location(option169, file$1, 175, 8, 9438);
    			option170.__value = "248";
    			option170.value = option170.__value;
    			add_location(option170, file$1, 176, 8, 9490);
    			option171.__value = "232";
    			option171.value = option171.__value;
    			add_location(option171, file$1, 177, 8, 9546);
    			option172.__value = "65";
    			option172.value = option172.__value;
    			add_location(option172, file$1, 178, 8, 9604);
    			option173.__value = "421";
    			option173.value = option173.__value;
    			add_location(option173, file$1, 179, 8, 9657);
    			option174.__value = "386";
    			option174.value = option174.__value;
    			add_location(option174, file$1, 180, 8, 9718);
    			option175.__value = "677";
    			option175.value = option175.__value;
    			add_location(option175, file$1, 181, 8, 9772);
    			option176.__value = "252";
    			option176.value = option176.__value;
    			add_location(option176, file$1, 182, 8, 9833);
    			option177.__value = "27";
    			option177.value = option177.__value;
    			add_location(option177, file$1, 183, 8, 9886);
    			option178.__value = "34";
    			option178.value = option178.__value;
    			add_location(option178, file$1, 184, 8, 9942);
    			option179.__value = "94";
    			option179.value = option179.__value;
    			add_location(option179, file$1, 185, 8, 9991);
    			option180.__value = "290";
    			option180.value = option180.__value;
    			add_location(option180, file$1, 186, 8, 10044);
    			option181.__value = "1869";
    			option181.value = option181.__value;
    			add_location(option181, file$1, 187, 8, 10100);
    			option182.__value = "1758";
    			option182.value = option182.__value;
    			add_location(option182, file$1, 188, 8, 10157);
    			option183.__value = "597";
    			option183.value = option183.__value;
    			add_location(option183, file$1, 189, 8, 10214);
    			option184.__value = "249";
    			option184.value = option184.__value;
    			add_location(option184, file$1, 190, 8, 10268);
    			option185.__value = "268";
    			option185.value = option185.__value;
    			add_location(option185, file$1, 191, 8, 10319);
    			option186.__value = "46";
    			option186.value = option186.__value;
    			add_location(option186, file$1, 192, 8, 10374);
    			option187.__value = "41";
    			option187.value = option187.__value;
    			add_location(option187, file$1, 193, 8, 10424);
    			option188.__value = "963";
    			option188.value = option188.__value;
    			add_location(option188, file$1, 194, 8, 10479);
    			option189.__value = "886";
    			option189.value = option189.__value;
    			add_location(option189, file$1, 195, 8, 10530);
    			option190.__value = "992";
    			option190.value = option190.__value;
    			add_location(option190, file$1, 196, 8, 10582);
    			option191.__value = "66";
    			option191.value = option191.__value;
    			add_location(option191, file$1, 197, 8, 10638);
    			option192.__value = "228";
    			option192.value = option192.__value;
    			add_location(option192, file$1, 198, 8, 10690);
    			option193.__value = "676";
    			option193.value = option193.__value;
    			add_location(option193, file$1, 199, 8, 10740);
    			option194.__value = "1868";
    			option194.value = option194.__value;
    			add_location(option194, file$1, 200, 8, 10791);
    			option195.__value = "216";
    			option195.value = option195.__value;
    			add_location(option195, file$1, 201, 8, 10860);
    			option196.__value = "90";
    			option196.value = option196.__value;
    			add_location(option196, file$1, 202, 8, 10913);
    			option197.__value = "993";
    			option197.value = option197.__value;
    			add_location(option197, file$1, 203, 8, 10963);
    			option198.__value = "1649";
    			option198.value = option198.__value;
    			add_location(option198, file$1, 204, 8, 11021);
    			option199.__value = "688";
    			option199.value = option199.__value;
    			add_location(option199, file$1, 205, 8, 11095);
    			option200.__value = "256";
    			option200.value = option200.__value;
    			add_location(option200, file$1, 206, 8, 11147);
    			option201.__value = "380";
    			option201.value = option201.__value;
    			add_location(option201, file$1, 207, 8, 11199);
    			option202.__value = "971";
    			option202.value = option202.__value;
    			add_location(option202, file$1, 208, 8, 11252);
    			option203.__value = "598";
    			option203.value = option203.__value;
    			add_location(option203, file$1, 209, 8, 11318);
    			option204.__value = "998";
    			option204.value = option204.__value;
    			add_location(option204, file$1, 210, 8, 11371);
    			option205.__value = "678";
    			option205.value = option205.__value;
    			add_location(option205, file$1, 211, 8, 11427);
    			option206.__value = "379";
    			option206.value = option206.__value;
    			add_location(option206, file$1, 212, 8, 11480);
    			option207.__value = "58";
    			option207.value = option207.__value;
    			add_location(option207, file$1, 213, 8, 11538);
    			option208.__value = "84";
    			option208.value = option208.__value;
    			add_location(option208, file$1, 214, 8, 11591);
    			option209.__value = "1";
    			option209.value = option209.__value;
    			add_location(option209, file$1, 215, 8, 11642);
    			option210.__value = "1";
    			option210.value = option210.__value;
    			add_location(option210, file$1, 216, 8, 11708);
    			option211.__value = "681";
    			option211.value = option211.__value;
    			add_location(option211, file$1, 217, 8, 11769);
    			option212.__value = "969";
    			option212.value = option212.__value;
    			add_location(option212, file$1, 218, 8, 11834);
    			option213.__value = "967";
    			option213.value = option213.__value;
    			add_location(option213, file$1, 219, 8, 11892);
    			option214.__value = "260";
    			option214.value = option214.__value;
    			add_location(option214, file$1, 220, 8, 11950);
    			option215.__value = "263";
    			option215.value = option215.__value;
    			add_location(option215, file$1, 221, 8, 12002);
    			if (ctx.ddi === void 0) add_render_callback(() => ctx.select_change_handler.call(select));
    			select.className = "block appearance-none w-full bg-white border border-gray-400 hover:border-gray-500 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline";
    			add_location(select, file$1, 5, 5, 118);
    			attr(path, "d", "M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z");
    			add_location(path, file$1, 225, 12, 12277);
    			attr(svg, "class", "fill-current h-4 w-4");
    			attr(svg, "xmlns", "http://www.w3.org/2000/svg");
    			attr(svg, "viewBox", "0 0 20 20");
    			add_location(svg, file$1, 224, 8, 12174);
    			div0.className = "pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700";
    			add_location(div0, file$1, 223, 4, 12067);
    			div1.className = "inline-block relative w-48";
    			add_location(div1, file$1, 4, 0, 71);
    			input.className = "shadow appearance-none border rounded w-32 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline";
    			input.id = "tel";
    			attr(input, "type", "tel");
    			input.placeholder = "Phone";
    			input.size = "9";
    			add_location(input, file$1, 228, 0, 12392);

    			dispose = [
    				listen(select, "change", ctx.select_change_handler),
    				listen(input, "input", ctx.input_input_handler)
    			];
    		},

    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},

    		m: function mount(target, anchor) {
    			insert(target, div1, anchor);
    			append(div1, select);
    			append(select, option0);
    			append(select, option1);
    			append(select, option2);
    			append(select, option3);
    			append(select, option4);
    			append(select, option5);
    			append(select, option6);
    			append(select, option7);
    			append(select, option8);
    			append(select, option9);
    			append(select, option10);
    			append(select, option11);
    			append(select, option12);
    			append(select, option13);
    			append(select, option14);
    			append(select, option15);
    			append(select, option16);
    			append(select, option17);
    			append(select, option18);
    			append(select, option19);
    			append(select, option20);
    			append(select, option21);
    			append(select, option22);
    			append(select, option23);
    			append(select, option24);
    			append(select, option25);
    			append(select, option26);
    			append(select, option27);
    			append(select, option28);
    			append(select, option29);
    			append(select, option30);
    			append(select, option31);
    			append(select, option32);
    			append(select, option33);
    			append(select, option34);
    			append(select, option35);
    			append(select, option36);
    			append(select, option37);
    			append(select, option38);
    			append(select, option39);
    			append(select, option40);
    			append(select, option41);
    			append(select, option42);
    			append(select, option43);
    			append(select, option44);
    			append(select, option45);
    			append(select, option46);
    			append(select, option47);
    			append(select, option48);
    			append(select, option49);
    			append(select, option50);
    			append(select, option51);
    			append(select, option52);
    			append(select, option53);
    			append(select, option54);
    			append(select, option55);
    			append(select, option56);
    			append(select, option57);
    			append(select, option58);
    			append(select, option59);
    			append(select, option60);
    			append(select, option61);
    			append(select, option62);
    			append(select, option63);
    			append(select, option64);
    			append(select, option65);
    			append(select, option66);
    			append(select, option67);
    			append(select, option68);
    			append(select, option69);
    			append(select, option70);
    			append(select, option71);
    			append(select, option72);
    			append(select, option73);
    			append(select, option74);
    			append(select, option75);
    			append(select, option76);
    			append(select, option77);
    			append(select, option78);
    			append(select, option79);
    			append(select, option80);
    			append(select, option81);
    			append(select, option82);
    			append(select, option83);
    			append(select, option84);
    			append(select, option85);
    			append(select, option86);
    			append(select, option87);
    			append(select, option88);
    			append(select, option89);
    			append(select, option90);
    			append(select, option91);
    			append(select, option92);
    			append(select, option93);
    			append(select, option94);
    			append(select, option95);
    			append(select, option96);
    			append(select, option97);
    			append(select, option98);
    			append(select, option99);
    			append(select, option100);
    			append(select, option101);
    			append(select, option102);
    			append(select, option103);
    			append(select, option104);
    			append(select, option105);
    			append(select, option106);
    			append(select, option107);
    			append(select, option108);
    			append(select, option109);
    			append(select, option110);
    			append(select, option111);
    			append(select, option112);
    			append(select, option113);
    			append(select, option114);
    			append(select, option115);
    			append(select, option116);
    			append(select, option117);
    			append(select, option118);
    			append(select, option119);
    			append(select, option120);
    			append(select, option121);
    			append(select, option122);
    			append(select, option123);
    			append(select, option124);
    			append(select, option125);
    			append(select, option126);
    			append(select, option127);
    			append(select, option128);
    			append(select, option129);
    			append(select, option130);
    			append(select, option131);
    			append(select, option132);
    			append(select, option133);
    			append(select, option134);
    			append(select, option135);
    			append(select, option136);
    			append(select, option137);
    			append(select, option138);
    			append(select, option139);
    			append(select, option140);
    			append(select, option141);
    			append(select, option142);
    			append(select, option143);
    			append(select, option144);
    			append(select, option145);
    			append(select, option146);
    			append(select, option147);
    			append(select, option148);
    			append(select, option149);
    			append(select, option150);
    			append(select, option151);
    			append(select, option152);
    			append(select, option153);
    			append(select, option154);
    			append(select, option155);
    			append(select, option156);
    			append(select, option157);
    			append(select, option158);
    			append(select, option159);
    			append(select, option160);
    			append(select, option161);
    			append(select, option162);
    			append(select, option163);
    			append(select, option164);
    			append(select, option165);
    			append(select, option166);
    			append(select, option167);
    			append(select, option168);
    			append(select, option169);
    			append(select, option170);
    			append(select, option171);
    			append(select, option172);
    			append(select, option173);
    			append(select, option174);
    			append(select, option175);
    			append(select, option176);
    			append(select, option177);
    			append(select, option178);
    			append(select, option179);
    			append(select, option180);
    			append(select, option181);
    			append(select, option182);
    			append(select, option183);
    			append(select, option184);
    			append(select, option185);
    			append(select, option186);
    			append(select, option187);
    			append(select, option188);
    			append(select, option189);
    			append(select, option190);
    			append(select, option191);
    			append(select, option192);
    			append(select, option193);
    			append(select, option194);
    			append(select, option195);
    			append(select, option196);
    			append(select, option197);
    			append(select, option198);
    			append(select, option199);
    			append(select, option200);
    			append(select, option201);
    			append(select, option202);
    			append(select, option203);
    			append(select, option204);
    			append(select, option205);
    			append(select, option206);
    			append(select, option207);
    			append(select, option208);
    			append(select, option209);
    			append(select, option210);
    			append(select, option211);
    			append(select, option212);
    			append(select, option213);
    			append(select, option214);
    			append(select, option215);

    			select_option(select, ctx.ddi);

    			append(div1, t216);
    			append(div1, div0);
    			append(div0, svg);
    			append(svg, path);
    			insert(target, t217, anchor);
    			insert(target, input, anchor);

    			input.value = ctx.phone;
    		},

    		p: function update(changed, ctx) {
    			if (changed.ddi) select_option(select, ctx.ddi);
    			if (changed.phone) input.value = ctx.phone;
    		},

    		i: noop,
    		o: noop,

    		d: function destroy(detaching) {
    			if (detaching) {
    				detach(div1);
    				detach(t217);
    				detach(input);
    			}

    			run_all(dispose);
    		}
    	};
    }

    function instance$1($$self, $$props, $$invalidate) {
    	let { ddi='', phone='' } = $$props;

    	function select_change_handler() {
    		ddi = select_value(this);
    		$$invalidate('ddi', ddi);
    	}

    	function input_input_handler() {
    		phone = this.value;
    		$$invalidate('phone', phone);
    	}

    	$$self.$set = $$props => {
    		if ('ddi' in $$props) $$invalidate('ddi', ddi = $$props.ddi);
    		if ('phone' in $$props) $$invalidate('phone', phone = $$props.phone);
    	};

    	return {
    		ddi,
    		phone,
    		select_change_handler,
    		input_input_handler
    	};
    }

    class Phone extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$1, create_fragment$1, safe_not_equal, ["ddi", "phone"]);
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

    /* src\Head.svelte generated by Svelte v3.4.0 */

    const file$2 = "src\\Head.svelte";

    function create_fragment$2(ctx) {
    	var nav, div, span, t;

    	return {
    		c: function create() {
    			nav = element("nav");
    			div = element("div");
    			span = element("span");
    			t = text(ctx.titulo);
    			span.className = "font-semibold text-xl tracking-tight";
    			add_location(span, file$2, 6, 4, 229);
    			div.className = "flex w-500 items-center flex-shrink-0 text-white mr-6";
    			add_location(div, file$2, 5, 2, 152);
    			nav.className = "flex items-center justify-between bg-teal-500 p-6 svelte-1po2c12";
    			add_location(nav, file$2, 4, 0, 85);
    		},

    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},

    		m: function mount(target, anchor) {
    			insert(target, nav, anchor);
    			append(nav, div);
    			append(div, span);
    			append(span, t);
    		},

    		p: function update(changed, ctx) {
    			if (changed.titulo) {
    				set_data(t, ctx.titulo);
    			}
    		},

    		i: noop,
    		o: noop,

    		d: function destroy(detaching) {
    			if (detaching) {
    				detach(nav);
    			}
    		}
    	};
    }

    function instance$2($$self, $$props, $$invalidate) {
    	let { titulo } = $$props;

    	$$self.$set = $$props => {
    		if ('titulo' in $$props) $$invalidate('titulo', titulo = $$props.titulo);
    	};

    	return { titulo };
    }

    class Head extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$2, create_fragment$2, safe_not_equal, ["titulo"]);

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

    /* src\App.svelte generated by Svelte v3.4.0 */

    const file$3 = "src\\App.svelte";

    function create_fragment$3(ctx) {
    	var title_value, link, t0, main, a, t2, t3, updating_ddi, updating_phone, t4, current;

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

    	add_binding_callback(() => bind(phone_1, 'ddi', phone_1_ddi_binding));
    	add_binding_callback(() => bind(phone_1, 'phone', phone_1_phone_binding));

    	var button = new Button({
    		props: { open: ctx.abreZap },
    		$$inline: true
    	});

    	return {
    		c: function create() {
    			link = element("link");
    			t0 = space();
    			main = element("main");
    			a = element("a");
    			a.textContent = "Fork me on GitHub";
    			t2 = space();
    			head.$$.fragment.c();
    			t3 = space();
    			phone_1.$$.fragment.c();
    			t4 = space();
    			button.$$.fragment.c();
    			link.rel = "stylesheet";
    			link.href = "https://cdnjs.cloudflare.com/ajax/libs/github-fork-ribbon-css/0.2.3/gh-fork-ribbon.min.css";
    			add_location(link, file$3, 16, 1, 417);
    			a.className = "github-fork-ribbon";
    			a.href = "https://url.to-your.repo";
    			a.dataset.ribbon = "Fork me on GitHub";
    			a.title = "Fork me on GitHub";
    			add_location(a, file$3, 20, 0, 689);
    			add_location(main, file$3, 19, 0, 681);
    		},

    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},

    		m: function mount(target, anchor) {
    			append(document.head, link);
    			insert(target, t0, anchor);
    			insert(target, main, anchor);
    			append(main, a);
    			append(main, t2);
    			mount_component(head, main, null);
    			append(main, t3);
    			mount_component(phone_1, main, null);
    			append(main, t4);
    			mount_component(button, main, null);
    			current = true;
    		},

    		p: function update(changed, ctx) {
    			if ((!current || changed.tit) && title_value !== (title_value = tit)) {
    				document.title = title_value;
    			}

    			var head_changes = {};
    			if (changed.tit) head_changes.titulo = tit;
    			head.$set(head_changes);

    			var phone_1_changes = {};
    			if (!updating_ddi && changed.ddi) {
    				phone_1_changes.ddi = ctx.ddi;
    			}
    			if (!updating_phone && changed.phone) {
    				phone_1_changes.phone = ctx.phone;
    			}
    			phone_1.$set(phone_1_changes);

    			var button_changes = {};
    			if (changed.abreZap) button_changes.open = ctx.abreZap;
    			button.$set(button_changes);
    		},

    		i: function intro(local) {
    			if (current) return;
    			head.$$.fragment.i(local);

    			phone_1.$$.fragment.i(local);

    			button.$$.fragment.i(local);

    			current = true;
    		},

    		o: function outro(local) {
    			head.$$.fragment.o(local);
    			phone_1.$$.fragment.o(local);
    			button.$$.fragment.o(local);
    			current = false;
    		},

    		d: function destroy(detaching) {
    			detach(link);

    			if (detaching) {
    				detach(t0);
    				detach(main);
    			}

    			head.$destroy();

    			phone_1.$destroy();

    			button.$destroy();
    		}
    	};
    }

    let tit   = 'OpenWhats';

    function instance$3($$self, $$props, $$invalidate) {
    	
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
    		init(this, options, instance$3, create_fragment$3, safe_not_equal, []);
    	}
    }

    const app = new App({
        target: document.body
    });

}());
//# sourceMappingURL=main.js.map
